interface Storage {
    get(key: string): string | null;
    set(key: string, value: string): void;
    remove(key: string): void;
    clear(): void;
}

export function createLocalStorage(): Storage {
    const isBrowser = typeof window !== 'undefined';

    return {
        get(key: string): string | null {
            if (!isBrowser) return null;
            try {
                return localStorage.getItem(key);
            } catch {
                return null;
            }
        },

        set(key: string, value: string): void {
            if (!isBrowser) return;
            try {
                localStorage.setItem(key, value);
            } catch (error) {
                console.error('Error setting localStorage value:', error);
            }
        },

        remove(key: string): void {
            if (!isBrowser) return;
            try {
                localStorage.removeItem(key);
            } catch (error) {
                console.error('Error removing localStorage value:', error);
            }
        },

        clear(): void {
            if (!isBrowser) return;
            try {
                localStorage.clear();
            } catch (error) {
                console.error('Error clearing localStorage:', error);
            }
        }
    };
}