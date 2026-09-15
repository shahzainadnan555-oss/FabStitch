"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSession } from "@/features/auth/session";
import {
  DEFAULT_COUNTRY,
  DEFAULT_CURRENCY,
  SUPPORTED_CURRENCIES,
  SUPPORTED_MARKETS,
  isCountryCode,
  isCurrencyCode,
  type CountryCode,
  type CurrencyCode,
} from "./market";
import { api } from "@/lib/api/client";
import { apiErrorMessage } from "@/lib/api/errors";
import type { components } from "@/lib/api/schema";

type Schema = components["schemas"];
type CountryOut = Schema["CountryOut"];
type CurrencyOut = Schema["CurrencyOut"];
type CountryListResponse = Schema["CountryListResponse"];
type CurrencyListResponse = Schema["CurrencyListResponse"];
type CustomerPreferencesOut = Schema["CustomerPreferencesOut"];
type CountryPreferenceUpdateRequest = Schema["CountryPreferenceUpdateRequest"];
type CurrencyPreferenceUpdateRequest =
  Schema["CurrencyPreferenceUpdateRequest"];

export type CountryOption = Omit<CountryOut, "code" | "default_currency"> & {
  code: CountryCode;
  default_currency: CurrencyCode;
};

export type CurrencyOption = Omit<CurrencyOut, "code"> & {
  code: CurrencyCode;
};

type PreferenceError = {
  message: string;
  retryable: boolean;
};

type MarketPreferenceValue = {
  country: CountryCode;
  currency: CurrencyCode;
  countries: CountryOption[];
  currencies: CurrencyOption[];
  loadingOptions: boolean;
  pending: boolean;
  contactPrefill: {
    accountId: string;
    name: string | null;
    email: string;
    phone: string;
  } | null;
  setCountry: (country: CountryCode) => void;
  setCurrency: (currency: CurrencyCode) => void;
  error: PreferenceError | null;
  retry: () => void;
  clearError: () => void;
};

const MarketPreferenceContext = createContext<MarketPreferenceValue | null>(
  null,
);

function validCountries(items: CountryOut[]): CountryOption[] {
  return items.flatMap((country) => {
    if (
      !isCountryCode(country.code) ||
      !isCurrencyCode(country.default_currency)
    ) {
      return [];
    }
    return [
      {
        ...country,
        code: country.code,
        default_currency: country.default_currency,
      },
    ];
  });
}

function validCurrencies(items: CurrencyOut[]): CurrencyOption[] {
  return items.flatMap((currency) =>
    isCurrencyCode(currency.code) ? [{ ...currency, code: currency.code }] : [],
  );
}

const FALLBACK_CURRENCY_LABELS: Record<
  (typeof SUPPORTED_CURRENCIES)[number],
  { name: string; symbol: string }
> = {
  USD: { name: "US Dollar", symbol: "$" },
  GBP: { name: "British Pound", symbol: "£" },
  TRY: { name: "Turkish Lira", symbol: "₺" },
  PKR: { name: "Pakistani Rupee", symbol: "Rs" },
  INR: { name: "Indian Rupee", symbol: "₹" },
  BDT: { name: "Bangladeshi Taka", symbol: "৳" },
  SGD: { name: "Singapore Dollar", symbol: "S$" },
};

function fallbackCountries(): CountryOption[] {
  return SUPPORTED_MARKETS.map((market, index) => ({
    code: market.countryCode,
    name: market.countryName,
    default_currency: market.defaultCurrency,
    ships_to: true,
    sort_order: (index + 1) * 10,
  }));
}

function fallbackCurrencies(): CurrencyOption[] {
  return SUPPORTED_CURRENCIES.map((code, index) => ({
    code,
    name: FALLBACK_CURRENCY_LABELS[code].name,
    symbol: FALLBACK_CURRENCY_LABELS[code].symbol,
    sort_order: (index + 1) * 10,
  }));
}

export function MarketPreferenceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    authenticated,
    profile,
    preferences: sessionPreferences,
    setPreferences: setSessionPreferences,
  } = useSession();
  const [country, setCountryState] = useState<CountryCode>(DEFAULT_COUNTRY);
  const [currency, setCurrencyState] = useState<CurrencyCode>(DEFAULT_CURRENCY);
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [currencies, setCurrencies] = useState<CurrencyOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<PreferenceError | null>(null);
  const retryAction = useRef<(() => void) | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([
      api.get<CountryListResponse>("/countries"),
      api.get<CurrencyListResponse>("/currencies"),
    ])
      .then(([countryResponse, currencyResponse]) => {
        if (!active) return;
        const loadedCountries = validCountries(countryResponse.items);
        const loadedCurrencies = validCurrencies(currencyResponse.items);
        const nextCountries =
          loadedCountries.length > 0 ? loadedCountries : fallbackCountries();
        const nextCurrencies =
          loadedCurrencies.length > 0 ? loadedCurrencies : fallbackCurrencies();
        setCountries(nextCountries);
        setCurrencies(nextCurrencies);
        setCountryState((current) =>
          nextCountries.some((item) => item.code === current)
            ? current
            : (nextCountries[0]?.code ?? current),
        );
        setCurrencyState((current) =>
          nextCurrencies.some((item) => item.code === current)
            ? current
            : (nextCurrencies[0]?.code ?? current),
        );
        setError(null);
        retryAction.current = null;
      })
      .catch(() => {
        if (!active) return;
        const nextCountries = fallbackCountries();
        const nextCurrencies = fallbackCurrencies();
        setCountries(nextCountries);
        setCurrencies(nextCurrencies);
        setError({
          retryable: true,
          message:
            "Country and currency options could not be loaded from FabStitch. Showing the supported market list until you retry.",
        });
        retryAction.current = () => {
          setLoadingOptions(true);
          setError(null);
          Promise.all([
            api.get<CountryListResponse>("/countries"),
            api.get<CurrencyListResponse>("/currencies"),
          ])
            .then(([countryResponse, currencyResponse]) => {
              const loadedCountries = validCountries(countryResponse.items);
              const loadedCurrencies = validCurrencies(currencyResponse.items);
              if (
                loadedCountries.length === 0 ||
                loadedCurrencies.length === 0
              ) {
                throw new Error("empty_options");
              }
              setCountries(loadedCountries);
              setCurrencies(loadedCurrencies);
              setError(null);
              retryAction.current = null;
            })
            .catch(() => {
              setError({
                retryable: true,
                message:
                  "Country and currency options could not be loaded from FabStitch. Showing the supported market list until you retry.",
              });
            })
            .finally(() => setLoadingOptions(false));
        };
      })
      .finally(() => {
        if (active) setLoadingOptions(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const sessionCountry = sessionPreferences?.country;
    const sessionCurrency = sessionPreferences?.currency;
    queueMicrotask(() => {
      if (sessionCountry && isCountryCode(sessionCountry)) {
        setCountryState(sessionCountry);
      }
      if (sessionCurrency && isCurrencyCode(sessionCurrency)) {
        setCurrencyState(sessionCurrency);
      }
    });
  }, [sessionPreferences]);

  const applyResponse = useCallback(
    (response: CustomerPreferencesOut) => {
      setSessionPreferences(response);
      if (response.country && isCountryCode(response.country)) {
        setCountryState(response.country);
      }
      if (response.currency && isCurrencyCode(response.currency)) {
        setCurrencyState(response.currency);
      }
    },
    [setSessionPreferences],
  );

  const setCountry = useCallback(
    (nextCountry: CountryCode) => {
      const previousCountry = country;
      const previousCurrency = currency;
      setCountryState(nextCountry);
      if (!authenticated) {
        const defaultCurrency = countries.find(
          (item) => item.code === nextCountry,
        )?.default_currency;
        if (defaultCurrency) setCurrencyState(defaultCurrency);
        return;
      }

      const update = async () => {
        setPending(true);
        setError(null);
        const body: CountryPreferenceUpdateRequest = {
          country: nextCountry,
          apply_currency_default: false,
        };
        try {
          const response = await api.put<
            CustomerPreferencesOut,
            CountryPreferenceUpdateRequest
          >("/me/preferences/country", { body });
          applyResponse(response);
          retryAction.current = null;
        } catch (requestError) {
          setCountryState(previousCountry);
          setCurrencyState(previousCurrency);
          setError({
            message: apiErrorMessage(
              requestError,
              "Your country preference could not be saved.",
            ),
            retryable: true,
          });
          retryAction.current = () => {
            setCountryState(nextCountry);
            void update();
          };
        } finally {
          setPending(false);
        }
      };
      void update();
    },
    [applyResponse, authenticated, countries, country, currency],
  );

  const setCurrency = useCallback(
    (nextCurrency: CurrencyCode) => {
      const previousCurrency = currency;
      setCurrencyState(nextCurrency);
      if (!authenticated) return;

      const update = async () => {
        setPending(true);
        setError(null);
        const body: CurrencyPreferenceUpdateRequest = {
          currency: nextCurrency,
        };
        try {
          const response = await api.put<
            CustomerPreferencesOut,
            CurrencyPreferenceUpdateRequest
          >("/me/preferences/currency", { body });
          applyResponse(response);
          retryAction.current = null;
        } catch (requestError) {
          setCurrencyState(previousCurrency);
          setError({
            message: apiErrorMessage(
              requestError,
              "Your currency preference could not be saved.",
            ),
            retryable: true,
          });
          retryAction.current = () => {
            setCurrencyState(nextCurrency);
            void update();
          };
        } finally {
          setPending(false);
        }
      };
      void update();
    },
    [applyResponse, authenticated, currency],
  );

  const value = useMemo<MarketPreferenceValue>(
    () => ({
      country,
      currency,
      countries,
      currencies,
      loadingOptions,
      pending,
      contactPrefill: profile
        ? {
            accountId: profile.id,
            name: profile.full_name,
            email: profile.email,
            phone: profile.phone ?? "",
          }
        : null,
      setCountry,
      setCurrency,
      error,
      retry: () => retryAction.current?.(),
      clearError: () => setError(null),
    }),
    [
      countries,
      country,
      currencies,
      currency,
      error,
      loadingOptions,
      pending,
      profile,
      setCountry,
      setCurrency,
    ],
  );

  return (
    <MarketPreferenceContext.Provider value={value}>
      {children}
    </MarketPreferenceContext.Provider>
  );
}

export function useMarketPreferences(): MarketPreferenceValue {
  const value = useContext(MarketPreferenceContext);
  if (!value) {
    throw new Error(
      "useMarketPreferences must be used inside MarketPreferenceProvider",
    );
  }
  return value;
}
