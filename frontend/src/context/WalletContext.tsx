import { createContext, useContext, useState, type ReactNode } from 'react';

interface WalletContextType {
    isConnected: boolean;
    address: string | null;
    balance: string | null;
    connect: () => void;
    disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [address, setAddress] = useState<string | null>(null);
    const [balance, setBalance] = useState<string | null>(null);

    const connect = () => {
        // Mock connection
        setTimeout(() => {
            setIsConnected(true);
            setAddress('0x71C...9A21');
            setBalance('14.5 ETH');
        }, 500);
    };

    const disconnect = () => {
        setIsConnected(false);
        setAddress(null);
        setBalance(null);
    };

    return (
        <WalletContext.Provider value={{ isConnected, address, balance, connect, disconnect }}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (context === undefined) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
};
