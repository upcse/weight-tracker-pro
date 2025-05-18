import React from 'react';
import Header from './Header';
import { motion } from 'framer-motion';
import CursorFollower from '../three/CursorFollower';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950">
      <CursorFollower />
      
      {/* Animated gradient backgrounds */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-100/20 via-transparent to-transparent dark:from-primary-900/20 animate-pulse-slow pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-secondary-100/20 via-transparent to-transparent dark:from-secondary-900/20 animate-pulse-slow pointer-events-none" />
      
      {/* Grid pattern overlay */}
      <div className="fixed inset-0 bg-grid-pattern opacity-5 dark:opacity-10 pointer-events-none" />
      
      <Header />
      
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="container mx-auto px-4 py-24 sm:px-6 relative z-10"
      >
        <div className="grid gap-8">
          {children}
        </div>
      </motion.main>
      
      {/* Decorative blobs */}
      <div className="fixed top-1/4 -right-1/4 w-1/2 h-1/2 bg-primary-500/10 dark:bg-primary-500/20 rounded-full blur-3xl animate-float pointer-events-none" />
      <div className="fixed -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-secondary-500/10 dark:bg-secondary-500/20 rounded-full blur-3xl animate-float pointer-events-none" />
    </div>
  );
};

export default Layout;