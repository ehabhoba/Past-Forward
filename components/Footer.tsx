/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

const Footer = () => {

    const handleShareWebsite = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Past Forward - Your AI Time Machine',
                    text: 'Generate yourself through the decades with AI! Developed by ehabgm.online',
                    url: window.location.href,
                });
            } catch (error) {
                console.error('Error sharing website:', error);
            }
        } else {
            // Fallback for browsers that don't support Web Share API
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard! Your browser doesn't support direct sharing.");
        }
    };

    return (
        <footer className="fixed bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-3 z-50 text-neutral-300 text-xs sm:text-sm border-t border-white/10">
            <div className="max-w-screen-xl mx-auto flex justify-between items-center gap-4 px-4">
                {/* Left Side */}
                <div className="hidden md:flex items-center text-neutral-400 whitespace-nowrap">
                    <p>
                        Developed by{' '}
                        <a
                            href="https://ehabgm.online"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-yellow-400 transition-colors duration-200"
                        >
                            ehabgm.online
                        </a>
                    </p>
                </div>

                {/* Right Side */}
                <div className="flex-grow flex justify-center md:justify-end items-center">
                    <div className="flex items-center gap-4 sm:gap-6">
                        <button
                            onClick={handleShareWebsite}
                            className="font-permanent-marker text-sm sm:text-base text-center text-black bg-yellow-400 py-2 px-4 rounded-sm transform transition-transform duration-200 hover:scale-105 hover:-rotate-2 hover:bg-yellow-300 shadow-[1px_1px_0px_1px_rgba(0,0,0,0.2)] whitespace-nowrap"
                        >
                            Share Website
                        </button>
                        <a
                            href="https://ehabgm.online"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-permanent-marker text-sm sm:text-base text-center text-white bg-white/10 backdrop-blur-sm border border-white/50 py-2 px-4 rounded-sm transform transition-transform duration-200 hover:scale-105 hover:rotate-2 hover:bg-white hover:text-black whitespace-nowrap"
                        >
                            ehabgm.online
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;