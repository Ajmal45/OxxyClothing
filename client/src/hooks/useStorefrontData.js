import { useState, useEffect } from 'react';
import { storefrontService } from '../services/storefrontService';

export const useHomepage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const abort = new AbortController();
        let cancelled = false;

        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await storefrontService.getHomepage();
                if (!cancelled) setData(res.data.data || res.data);
            } catch (err) {
                if (!cancelled && err.name !== 'CanceledError') {
                    setError(err.response?.data?.message || 'Failed to load homepage');
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        load();
        return () => { cancelled = true; abort.abort(); };
    }, []);

    return { data, loading, error };
};

export const useProducts = (params) => {
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const abort = new AbortController();
        let cancelled = false;

        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await storefrontService.getProducts(params, { signal: abort.signal });
                if (!cancelled) {
                    setData(res.data.data || []);
                    setPagination(res.data.pagination || null);
                }
            } catch (err) {
                if (!cancelled && err.name !== 'CanceledError') {
                    setError(err.response?.data?.message || 'Failed to load products');
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        load();
        return () => { cancelled = true; abort.abort(); };
    }, [JSON.stringify(params)]);

    return { data, pagination, loading, error };
};

export const useProduct = (slug) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!slug) return;
        const abort = new AbortController();
        let cancelled = false;

        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await storefrontService.getProduct(slug, { signal: abort.signal });
                if (!cancelled) setData(res.data.data || res.data);
            } catch (err) {
                if (!cancelled && err.name !== 'CanceledError') {
                    if (err.response?.status === 404) setError('Product not found');
                    else setError(err.response?.data?.message || 'Failed to load product');
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        load();
        return () => { cancelled = true; abort.abort(); };
    }, [slug]);

    return { data, loading, error };
};

export const useCollections = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await storefrontService.getCollections();
                if (!cancelled) setData(res.data.data || []);
            } catch (err) {
                if (!cancelled) setError(err.response?.data?.message || 'Failed to load collections');
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        load();
        return () => { cancelled = true; };
    }, []);

    return { data, loading, error };
};

export const usePublicSettings = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            try {
                const res = await storefrontService.getPublicSettings();
                if (!cancelled) setData(res.data.data || res.data);
            } catch {
                // silent — settings are optional
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        load();
        return () => { cancelled = true; };
    }, []);

    return { data, loading };
};
