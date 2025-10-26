/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
// FIX: Re-implemented the PolaroidCard component to fix file corruption issues.
// This component displays an image in a polaroid-style card and handles
// loading, error, and success states, along with actions like regenerating,
// downloading, and sharing.
import React from 'react';
import { motion } from 'framer-motion';
import { DraggableCardBody, DraggableCardContainer } from './ui/draggable-card';

// SVG icons to avoid external dependencies
const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
);
const ShareIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" /></svg>
);
const RefreshIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 4a14.95 14.95 0 0114.65 14.65M20 20a14.95 14.95 0 01-14.65-14.65" /></svg>
);
const AlertTriangleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 mb-2 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
);

const Spinner = () => (
    <div className="flex flex-col items-center justify-center text-neutral-500 text-center w-full h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-500"></div>
        <p className="mt-4 text-sm font-mono tracking-widest uppercase">Developing...</p>
    </div>
);

const ErrorMessage = ({ message, onRetry }: { message?: string; onRetry: () => void; }) => (
    <div className="text-center text-red-600 p-2 flex flex-col items-center justify-center h-full">
        <AlertTriangleIcon />
        <p className="text-sm font-sans mb-3">{message || 'Something went wrong.'}</p>
        <button onClick={onRetry} className="font-permanent-marker text-xs text-center text-black bg-yellow-400 py-1 px-3 rounded-sm transform transition-transform duration-200 hover:scale-105 hover:-rotate-2 hover:bg-yellow-300 shadow-[1px_1px_0px_1px_rgba(0,0,0,0.1)]">
            Try Again
        </button>
    </div>
);

const Placeholder = ({ caption }: { caption: string }) => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-200 text-neutral-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        <p className="mt-2 text-sm text-center px-2">{caption}</p>
    </div>
);

interface PolaroidCardProps {
    caption: string;
    status: 'pending' | 'done' | 'error';
    imageUrl?: string;
    error?: string;
    onShake?: (caption: string) => void; // Regenerate
    onDownload?: (caption: string) => void;
    onShare?: (caption: string) => void;
    isMobile?: boolean;
    dragConstraintsRef?: React.RefObject<HTMLDivElement>;
}

const actionButtonClasses = "p-1 rounded-full text-neutral-600 hover:bg-neutral-200 hover:text-black transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400";

const PolaroidCard: React.FC<PolaroidCardProps> = ({
    caption,
    status,
    imageUrl,
    error,
    onShake,
    onDownload,
    onShare,
    isMobile = false,
    dragConstraintsRef,
}) => {
    const handleRetry = () => {
        onShake?.(caption);
    };

    const cardContent = (
        <div className="w-80 h-[26rem] rounded-md bg-neutral-100 p-4 shadow-xl flex flex-col justify-between font-permanent-marker select-none">
            {/* Image Area with Flipping Animation */}
            <div className="w-full h-72 [perspective:1000px]">
                <motion.div
                    className="relative w-full h-full [transform-style:preserve-3d]"
                    animate={{ rotateY: status === 'pending' ? 180 : 0 }}
                    transition={{ duration: 0.6, type: 'spring' }}
                >
                    {/* Front Face */}
                    <div className="absolute w-full h-full [backface-visibility:hidden] flex items-center justify-center bg-neutral-200 overflow-hidden">
                        {status === 'error' && <ErrorMessage message={error} onRetry={handleRetry} />}
                        {status === 'done' && imageUrl && (
                            <img src={imageUrl} alt={caption} className="w-full h-full object-cover image-develop" loading="lazy" />
                        )}
                        {status === 'done' && !imageUrl && <Placeholder caption={caption} />}
                    </div>
                    {/* Back Face */}
                    <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] flex items-center justify-center bg-neutral-200 developing-back">
                        <Spinner />
                    </div>
                </motion.div>
            </div>
            
            {/* Caption Area */}
            <div className="flex justify-between items-center mt-4 px-1 h-10">
                <p className="text-2xl text-black truncate pr-2">{caption}</p>
                <div className="flex gap-2 items-center">
                    {status === 'done' && imageUrl && onShake && (
                         <button onClick={handleRetry} className={actionButtonClasses} title="Regenerate Image">
                            <RefreshIcon />
                        </button>
                    )}
                    {status === 'done' && imageUrl && onDownload && (
                        <button onClick={() => onDownload!(caption)} className={actionButtonClasses} title="Download Image">
                            <DownloadIcon />
                        </button>
                     )}
                    {status === 'done' && imageUrl && onShare && (
                        <button onClick={() => onShare!(caption)} className={actionButtonClasses} title="Share Image">
                            <ShareIcon />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

    if (isMobile) {
        return (
             <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
             >
                {cardContent}
            </motion.div>
        );
    }
    
    return (
        <DraggableCardContainer>
             <DraggableCardBody 
                dragConstraintsRef={dragConstraintsRef}
                onShake={handleRetry}
             >
                {cardContent}
            </DraggableCardBody>
        </DraggableCardContainer>
    );
};

export default PolaroidCard;