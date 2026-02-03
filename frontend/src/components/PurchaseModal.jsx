import React, { useState, useCallback, useEffect } from 'react';
import { X, User, CreditCard, CheckCircle, Copy, Check } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const PurchaseModal = ({ rank, isOpen, onClose }) => {
  const [username, setUsername] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [redeemCode, setRedeemCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    loadRazorpayScript().then((loaded) => {
      setRazorpayLoaded(loaded);
    });
  }, []);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(redeemCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setUsername('');
    setIsProcessing(false);
    setPaymentSuccess(false);
    setRedeemCode('');
    setCopied(false);
    onClose();
  };

  const handlePayment = useCallback(async (e) => {
    e.preventDefault();
    if (!username.trim() || !rank || !razorpayLoaded) return;
    
    setIsProcessing(true);
    
    try {
      // Create order on backend
      const orderResponse = await axios.post(`${API}/create-order`, {
        rank_id: rank.id,
        rank_name: rank.name,
        amount: rank.price,
        username: username.trim()
      });
      
      const { order_id, amount, currency, key_id } = orderResponse.data;
      
      // Configure Razorpay options
      const options = {
        key: key_id,
        amount: amount,
        currency: currency,
        name: "SNOWY MC",
        description: `${rank.name} Rank Purchase`,
        order_id: order_id,
        handler: async (response) => {
          try {
            // Verify payment on backend
            const verifyResponse = await axios.post(`${API}/verify-payment`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              username: username.trim(),
              rank_name: rank.name,
              amount: rank.price
            });
            
            if (verifyResponse.data.success) {
              setRedeemCode(verifyResponse.data.redeem_code);
              setPaymentSuccess(true);
            }
          } catch (error) {
            console.error('Payment verification failed:', error);
            alert('Payment verification failed. Please contact support.');
          }
          setIsProcessing(false);
        },
        prefill: {
          name: username.trim(),
        },
        theme: {
          color: rank.color
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          }
        }
      };
      
      // Open Razorpay checkout
      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.on('payment.failed', (response) => {
        console.error('Payment failed:', response.error);
        alert(`Payment failed: ${response.error.description}`);
        setIsProcessing(false);
      });
      razorpayInstance.open();
      
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
      setIsProcessing(false);
    }
  }, [username, rank, razorpayLoaded]);

  if (!isOpen || !rank) return null;

  // Success Screen with Redeem Code
  if (paymentSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={handleClose}
        />
        
        <div className="relative bg-[#16161b] border border-gray-800/50 rounded-2xl p-8 w-full max-w-md animate-in fade-in zoom-in duration-200">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="text-center">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: `${rank.color}20` }}
            >
              <CheckCircle className="w-10 h-10" style={{ color: rank.color }} />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2">
              Payment Successful!
            </h3>
            <p className="text-gray-400 mb-6">
              Thank you for purchasing {rank.name} rank!
            </p>
            
            {/* Redeem Code Display */}
            <div className="bg-[#0f0f13] border border-gray-700/50 rounded-xl p-4 mb-6">
              <p className="text-gray-400 text-sm mb-2">Your Redeem Code:</p>
              <div className="flex items-center justify-between gap-2 bg-[#1a1a1f] rounded-lg px-4 py-3">
                <code className="text-lg font-mono font-bold" style={{ color: rank.color }}>
                  {redeemCode}
                </code>
                <button
                  onClick={handleCopyCode}
                  className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <Copy className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-300">
                <span className="font-semibold text-[#8B5CF6]">How to use:</span> Join the server at <span className="font-mono text-white">play.snowymc.in</span> and use the redeem code in-game to activate your rank!
              </p>
            </div>
            
            <button
              onClick={handleClose}
              className="w-full py-3 rounded-lg font-semibold transition-all duration-200 uppercase tracking-wider text-sm text-white"
              style={{ backgroundColor: rank.color }}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Payment Form
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-[#16161b] border border-gray-800/50 rounded-2xl p-6 w-full max-w-md animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="text-center mb-6">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: `${rank.color}20` }}
          >
            <CreditCard className="w-6 h-6" style={{ color: rank.color }} />
          </div>
          <h3 className="text-xl font-bold text-white mb-1">
            Purchase {rank.name} Rank
          </h3>
          <p className="text-gray-400 text-sm">
            Complete your purchase for ₹{rank.price} {rank.currency}
          </p>
        </div>
        
        <form onSubmit={handlePayment}>
          <div className="mb-6">
            <label className="block text-gray-400 text-sm mb-2">
              Minecraft Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full bg-[#0f0f13] border border-gray-700/50 rounded-lg px-4 py-3 pl-11 text-white placeholder-gray-500 focus:outline-none focus:border-[#8B5CF6] transition-colors"
                required
                disabled={isProcessing}
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isProcessing || !username.trim() || !razorpayLoaded}
            className="w-full py-3 rounded-lg font-semibold transition-all duration-200 uppercase tracking-wider text-sm disabled:opacity-50 disabled:cursor-not-allowed text-white"
            style={{ backgroundColor: rank.color }}
          >
            {isProcessing ? 'Processing...' : `Pay ₹${rank.price}`}
          </button>
        </form>
        
        <p className="text-center text-gray-500 text-xs mt-4">
          Powered by Razorpay • Secure Payment
        </p>
      </div>
    </div>
  );
};

export default PurchaseModal;
