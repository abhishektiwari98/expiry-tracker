"use client";
import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

interface ScannerProps {
    onScan: (itemName: string) => void;
}

const Scanner = ({ onScan }: ScannerProps) => {
    const [scanning, setScanning] = useState(false);
    const [data, setData] = useState<string | null>(null);

    useEffect(() => {
        if (scanning) {
            const scanner = new Html5QrcodeScanner(
                "reader",
                { fps: 10, qrbox: { width: 250, height: 250 } },
                false
            );

            scanner.render(
                async (decodedText) => {
                    setData(decodedText);
                    setScanning(false);
                    scanner.clear();

                    // Fetch item details
                    try {
                        const response = await fetch(`/api/items?barcode=${decodedText}`);
                        const itemData = await response.json();

                        if (itemData && itemData.name) {
                            onScan(itemData.name);
                        } else {
                            onScan("");
                        }
                    } catch (error) {
                        console.error("Error fetching item details:", error);
                        onScan("");
                    }
                },
                (error) => console.log(error)
            );

            return () => {
                scanner.clear();
            };
        }
    }, [scanning]);

    return (
        <div className="flex flex-col items-center space-y-4 p-6">
            <button
                onClick={() => setScanning(!scanning)}
                className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition"
            >
                {scanning ? "Stop Scanner" : "Scan Item"}
            </button>

            {scanning && <div id="reader" className="mt-4"></div>}

            {data && (
                <p className="text-gray-700 font-medium">
                    Scanned Barcode: <span className="text-blue-600">{data}</span>
                </p>
            )}
        </div>
    );
};

export default Scanner;
