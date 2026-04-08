import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../services/firebase'; 
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper function to fetch Firestore data
  // We make this separate so we can call it manually if needed
  const fetchUserProfile = async (firebaseUser) => {
    try {
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUser({
          ...firebaseUser,
          ...userData,
          // Ensure role is always there for your ProtectedRoute checks
          role: userData.role || 'applicant' 
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return false;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        // Try to fetch profile
        const success = await fetchUserProfile(firebaseUser);
        
        // RACE CONDITION FIX: 
        // If Firestore isn't ready yet (common during signup), 
        // wait 1 second and try one more time.
        if (!success) {
          setTimeout(async () => {
            await fetchUserProfile(firebaseUser);
            setLoading(false);
          }, 1000);
          return; // Exit early to let the timeout finish
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getInitials = (name) => {
    if (!name) return "??";
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      logout, 
      getInitials, 
      loading,
      refreshUser: () => auth.currentUser && fetchUserProfile(auth.currentUser) 
    }}>
      {/* Show nothing or a loading spinner while checking auth */}
      {!loading ? children : (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #0051d3', borderRadius: '50%' }}></div>
        </div>
      )}
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } } .animate-spin { animation: spin 1s linear infinite; }`}</style>
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);