/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
    progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
    return (
        <motion.div
            className="w-full max-w-md text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
        >
            <p className="font-permanent-marker text-lg text-neutral-300 mb-2">
                Generating your timeline... {Math.round(progress)}%
            </p>
            <div className="w-full bg-black/30 rounded-full h-4 overflow-hidden border-2 border-white/20 shadow-inner">
                <motion.div
                    className="bg-yellow-400 h-full rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                />
            </div>
        </motion.div>
    );
};

export default ProgressBar;
