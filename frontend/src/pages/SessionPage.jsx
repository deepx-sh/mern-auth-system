import React from 'react'
import { useContext } from 'react';
import { useState } from 'react';
import UserContext from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import apiClient from '../lib/apiClient';
import { toast } from 'react-toastify';
import parseUserAgent from '../utils/parseUserAgent';

const SessionPage = () => {

    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [revokingId, setRevokingId] = useState(null);
    const [logoutLoading, setLogoutLoading] = useState(false);
    const { setUserData } = useContext(UserContext);

    const navigate = useNavigate();
    
    useEffect(() => {
        fetchSessions();
    }, []);

    async function fetchSessions() {
        setLoading(true);

        try {
            const res = await apiClient.get("/auth/sessions");
            const payload = res.data || {};
            const data = payload.data || [];
            setSessions(data);
        } catch (error) {
            const msg = error?.response?.data?.message || "Could not load sessions";
            toast.error(msg);
        } finally {
            setLoading(false)
        }
    }

    function formatDate(iso) {
        if (!iso) return "-";

        try {
            const d = new Date(iso);
            return d.toLocaleString();
        } catch (error) {
            console.log(error);
            
            return iso
        }
    }

    async function revokeSession(sessionId) {
        if (!sessionId) return;
        const ok = window.confirm("Revoke this session? The device will be logged out.");
        if (!ok) return;

        setRevokingId(sessionId);

        try {
            await apiClient.delete(`/auth/sessions/${sessionId}`);
            toast.success("Session revoked");
            setSessions((s) => s.filter((x) => x.id !== sessionId));
        } catch (error) {
            console.log("Revoke failed",error);
            const msg = error?.response?.data?.message || "Could not revoke session"
            toast.error(msg);
        } finally {
            setRevokingId(null);
        }
    }

    async function handleLogoutCurrent() {
        const ok = window.confirm("Log out of this device? This will end your current session");
        if (!ok) return;

        setLogoutLoading(true);
        try {
            await apiClient.post("/auth/logout");
            setUserData(null);
            toast.success("Logged out");
            navigate("/login");
        } catch (error) {
            console.log("Logout failed",error);
            setUserData(null);
            const msg = error?.response?.data?.message || "Logout failed you have been signed out locally";
            toast.error(msg);
            navigate("/login")
        } finally {
            setLogoutLoading(false)
        }
    }

    async function handleRevokeAll() {
        const ok = window.confirm("Revoke all sessions on all devices? This will sign out everywhere");
        if (!ok) return;

        try {
            await apiClient.post("/auth/logout-all");
            toast.success("All sessions revoked");
            setSessions([]);
            setUserData(null);
            localStorage.removeItem("userData");
            navigate("/login");
        } catch (error) {
            console.log("Revoke all failed",error);
            const msg = error?.response?.data?.message || "Could not revoke all sessions"
            toast.error(msg);
        }
    }
  return (
      <main className='min-h-[60vh] p-6 bg-[#F5F4F1]'>
          <div className='mx-auto max-w-4xl'>
              <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between  mb-6'>
                  <div>
                      <h1 className='text-2xl font-semibold text-[#0D0D0D]'>Active sessions</h1>
                      <p className='mt-1 text-sm text-[#6B6B6B]'>Manage devices and sign out from sessions you no longer use</p>
                  </div>

                  <div className='flex items-center gap-2'>
                      <button onClick={fetchSessions} className='px-3 py-2 rounded-md border border-[#E6E6E6] text-sm hover:bg-[#FBF7F3] transition' aria-label='Refresh sessions'>Refresh</button>
                      <button onClick={handleRevokeAll} className='px-3 py-2 rounded-md bg-[#FF6B00] text-sm text-white hover:bg-[#E65A00] transition shadow' aria-label='Revoke all sessions'>Revoke all</button>
                  </div>
              </div>

              <div className='bg-white rounded-2xl p-4 ring-1 ring-[#EDEDED] shadow-sm'>
                  {loading ? (
                      <div className='py-12 text-center text-[#6B6B6B]'>Loading sessions...</div>
                  ) : sessions.length === 0 ? (
                          <div className='py-12 text-center text-[#6B6B6B]'>No active sessions found.</div>
                      ) : (
                              <div className='space-y-3'>{sessions.map((s) => {
                                  const info = parseUserAgent(s.userAgent);
                                  return (
                                        //   const info=parseUserAgent(s.userAgent)
                                      <div key={s.id} className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 rounded-lg border border-[#F0F0F0] hover:bg-[#FCFBFA] transition'>
                                          <div className='flex-1 min-w-0'>
                                              <div className='flex items-center gap-3'>
                                                  <div className='w-12 h-12 flex items-center justify-center rounded-md bg-[#0D0D0D] text-white text-sm font-medium'>
                                                      {s.userAgent ? s.userAgent[0].toUpperCase() : "D"}
                                                  </div>

                                                  <div className='truncate'>
                                                      <div className='text-sm font-medium text-[#0D0D0D] truncate'>
                                                            {info.browser} on {info.os}
                                                      </div>

                                                      <div className='text-xs text-[#6B6B6B] truncate'>
                                                            {info.device}
                                                      </div>
                                                  </div>

                                                  {s.isCurrent && (
                                                      <span className='inline-flex shrink-0 whitespace-nowrap items-center rounded-full bg-[#E8F8F1] px-2 py-0.5 text-xs text-[#0B9E6F]'>Current device</span>
                                                  )}
                                              </div>

                                              <div className='mt-2 text-xs text-[#6B6B6B] grid grid-cols-1 sm:grid-cols-3 gap-2'>
                                                  <div>
                                                      <div className='text-[11px] text-[#999]'>Created</div>
                                                      <div className='text-[13px] text-[#333]'>{formatDate(s.createdAt)}</div>
                                                  </div>

                                                  <div>
                                                      <div className='text-[11px] text-[#999]'>Last used</div>
                                                      <div className='text-[13px] text-[#333]'>{formatDate(s.lastUsedAt)}</div>
                                                  </div>

                                                  <div>
                                                      <div className='text-[11px] text-[#999]'>Expire</div>
                                                      <div className='text-[13px] text-[#333]'>{formatDate(s.expiresAt)}</div>
                                                  </div>
                                              </div>
                                          </div>

                                          <div className='shrink-0 flex items-center gap-2'>
                                              {s.isCurrent ? (
                                                  <button onClick={handleLogoutCurrent} disabled={logoutLoading} className='px-3 py-2 rounded-md bg-[#FF6B00] text-white text-sm hover:bg-[#E65A00] transition' title='Log out from this device'>{logoutLoading ? "Signing out..." : "Sign out here"}</button>
                                              ) : (
                                                  <button onClick={() => revokeSession(s.id)} disabled={revokingId === s.id} className='px-3 py-2 rounded-md border border-[#E6E6E6] text-sm hover:bg-[#FFF8F3] transition' title='Revoke this session'>{revokingId === s.id ? "Revoking..." : "Revoke"}</button>
                                              )}
                                          </div>
                                      </div>
                                  );
                              })}</div>
                  )}
              </div>

              <div className='mt-6 text-sm text-[#6B6B6B]'>
                  Tip: Revoke sessions you don't recognize. If you suspect your account was compromised, revoke all sessions and change your password.
              </div>
          </div>
    </main>
  )
}

export default SessionPage