// If using bearer-token based session management, we'll store the token

import { useEffect, useState } from "react";
import { DataError, DataResponse } from "../models";

// in localStorage using this key.
const AUTH_TOKEN_KEY = 'auth_token';

const API_URL = 'https://readonlydemo.vendure.io/shop-api';

let languageCode: string | undefined;
let channelToken: string | undefined;

export function setLanguageCode(value: string | undefined) {
  languageCode = value;
}

export function setChannelToken(value: string | undefined) {
  channelToken = value;
}

export function query(document: string, variables: Record<string, any> = {}) {
  const authToken = localStorage.getItem(AUTH_TOKEN_KEY);
  const headers = new Headers({
    'content-type': 'application/json',
  });
  if (authToken) {
    headers.append('authorization', `Bearer ${authToken}`);
  }
  if (channelToken) {
    headers.append('vendure-token', channelToken);
  }
  let endpoint = API_URL;
  if (languageCode) {
    endpoint += `?languageCode=${languageCode}`;
  }
  return fetch(endpoint, {
    method: 'POST',
    headers,
    credentials: 'include',
    body: JSON.stringify({
      query: document,
      variables,
    }),
  }).then((res) => {
    if (!res.ok) {
      throw new Error(`An error ocurred, HTTP status: ${res.status}`);
    }
    const newAuthToken = res.headers.get('vendure-auth-token');
    if (newAuthToken) {
      localStorage.setItem(AUTH_TOKEN_KEY, newAuthToken);
    }
    return res.json();
  });
}

/**
 * Here we have wrapped the `query` function into a React hook for convenient use in
 * React components.
 */
export function useQuery(
  document: string,
  variables: Record<string, any> = {},
  deps: any[] = []
) {
  const [data, setData] = useState<DataResponse | null>(null);
  const [error, setError] = useState<DataError | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    query(document, variables)
      .then((result) => {
        setData(result.data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setData(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, deps);

  return { data, loading, error };
}
