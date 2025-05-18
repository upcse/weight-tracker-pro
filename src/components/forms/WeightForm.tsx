import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, CheckCircle } from 'lucide-react';
import { useWeightStore } from '../../store/weightStore';
import dayjs from 'dayjs';

const WeightForm: React.FC = () => {
  const { addWeightEntry, isAddingWeight, setIsAddingWeight, getCurrentWeight } = useWeightStore();
  const [weight, setWeight] = useState(getCurrentWeight().toString());
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addWeightEntry({
      weight: parseFloat(weight),
      date,
      notes: notes.trim() || undefined
    });
    
    // Show success animation
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setIsAddingWeight(false);
      
      // Reset form for next time
      setWeight(getCurrentWeight().toString());
      setDate(dayjs().format('YYYY-MM-DD'));
      setNotes('');
    }, 1500);
  };
  
  const handleCancel = () => {
    setIsAddingWeight(false);
  };
  
  if (!isAddingWeight) {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsAddingWeight(true)}
        className="fixed right-6 bottom-6 z-10 bg-primary-600 dark:bg-primary-500 text-white rounded-full p-3 shadow-lg flex items-center justify-center"
        aria-label="Add weight entry"
      >
        <Plus size={24} />
      </motion.button>
    );
  }
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
        onClick={handleCancel}
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white dark:bg-dark-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {isSubmitted ? (
            <div className="p-6 flex flex-col items-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="mb-4 text-success-500"
              >
                <CheckCircle size={60} />
              </motion.div>
              <h3 className="text-xl font-semibold text-center text-dark-900 dark:text-white">
                Weight Added Successfully!
              </h3>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-dark-700">
                <h3 className="text-lg font-semibold text-dark-900 dark:text-white">
                  Add Weight Entry
                </h3>
                <button 
                  onClick={handleCancel}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-4">
                <div className="mb-4">
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    id="weight"
                    step="0.1"
                    min="0"
                    required
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring focus:ring-primary-500/20 focus:border-primary-500 dark:bg-dark-700 dark:text-white"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    max={dayjs().format('YYYY-MM-DD')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring focus:ring-primary-500/20 focus:border-primary-500 dark:bg-dark-700 dark:text-white"
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Notes (optional)
                  </label>
                  <textarea
                    id="notes"
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring focus:ring-primary-500/20 focus:border-primary-500 dark:bg-dark-700 dark:text-white"
                    placeholder="How are you feeling today?"
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
                  >
                    Save
                  </motion.button>
                </div>
              </form>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WeightForm;