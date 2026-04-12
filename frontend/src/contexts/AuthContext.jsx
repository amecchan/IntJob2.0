import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../services/firebase'; 
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper function to fetch Firestore data
  const fetchUserProfile = async (firebaseUser) => {
    try {
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const role = userData.role || 'applicant';
        
        setUser({
          ...firebaseUser,
          ...userData,
          role: role
        });
        setUserRole(role);
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
        let success = await fetchUserProfile(firebaseUser);
        
        if (!success) {
          let retries = 0;
          const maxRetries = 3;
          
          const retryInterval = setInterval(async () => {
            retries++;
            success = await fetchUserProfile(firebaseUser);
            
            if (success || retries >= maxRetries) {
              clearInterval(retryInterval);
              setLoading(false);
            }
          }, 1500);
          return; 
        }
      } else {
        setUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // --- REMOVED THE ISVERIFIED EFFECT FROM HERE ---
  // That logic belongs in VerifyEmail.jsx, not in the AuthContext.

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserRole(null);
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

  const refreshUser = async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      return await fetchUserProfile(auth.currentUser);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      userRole, 
      logout, 
      getInitials, 
      loading,
      refreshUser 
    }}>
      {!loading ? children : (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
          <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #0051d3', borderRadius: '50%' }}></div>
          <p style={{ color: '#0051d3', fontWeight: '600', fontFamily: 'sans-serif' }}>Loading Profile...</p>
        </div>
      )}
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } } .animate-spin { animation: spin 1s linear infinite; }`}</style>
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);