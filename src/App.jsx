import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabase.js";

// ─── Shared Styles ────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Syne:wght@400;500;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  :root{
    --bg:#07080f;
    --bg2:#0c0e1a;
    --bg3:#111425;
    --border:#1e2340;
    --border2:#262b4a;
    --text:#f0f2ff;
    --muted:#6b7296;
    --muted2:#3d4266;
    --orange:#ff8c59;
    --orange2:#ffb37f;
    --green:#7ca63a;
    --green2:#a3bf5f;
    --grad:linear-gradient(90deg,#ff8c59,#ffb37f 40%,#a3bf5f 70%,#7ca63a);
    --grad2:linear-gradient(135deg,#ff8c59,#7ca63a);
    --red:#ef4444;
    --teal:#34d399;
    --blue:#60a5fa;
  }
  body{background:var(--bg);font-family:'Plus Jakarta Sans',sans-serif;color:var(--text)}
  ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:var(--border2);border-radius:2px}

  /* ── Base elements ── */
  textarea{background:var(--bg2);border:1px solid var(--border);border-radius:10px;color:var(--text);font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;line-height:1.6;padding:13px;resize:none;width:100%;outline:none;transition:border-color .2s}
  textarea:focus{border-color:var(--orange)}
  input,select{background:var(--bg2);border:1px solid var(--border);border-radius:10px;color:var(--text);font-family:'Plus Jakarta Sans',sans-serif;font-size:12px;padding:10px 14px;outline:none;transition:border-color .2s,box-shadow .2s;width:100%}
  input:focus,select:focus{border-color:var(--orange);box-shadow:0 0 0 3px rgba(255,140,89,.1)} 
  input[type=checkbox]{width:auto;cursor:pointer} input[type=date]{color-scheme:dark}
  select option{background:var(--bg3)}

  /* ── Buttons ── */
  .btn{border:none;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;font-size:11px;font-weight:600;letter-spacing:.3px;padding:9px 18px;border-radius:8px;transition:all .2s}
  .gold{background:var(--grad);color:#fff;font-weight:600}.gold:hover{opacity:.9;transform:translateY(-1px);box-shadow:0 4px 20px rgba(255,140,89,.3)}
  .ghost{background:transparent;color:var(--muted);border:1px solid var(--border)}.ghost:hover{border-color:var(--border2);color:var(--text)}
  .grn{background:rgba(124,166,58,.12);color:var(--green2);border:1px solid rgba(124,166,58,.25)}.grn:hover{background:rgba(124,166,58,.2)}
  .red-btn{background:rgba(239,68,68,.1);color:var(--red);border:1px solid rgba(239,68,68,.25)}.red-btn:hover{background:rgba(239,68,68,.18)}

  /* ── Nav tabs ── */
  .tab{background:none;border:none;cursor:pointer;padding:7px 14px;font-family:'Plus Jakarta Sans',sans-serif;font-size:10px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;transition:all .2s;border-radius:8px;color:var(--muted)}
  .tab:hover{color:var(--text);background:var(--bg3)} 
  .tab.on{background:rgba(255,140,89,.12)!important;color:var(--orange)!important;border:1px solid rgba(255,140,89,.2)}

  /* ── Review card ── */
  .rc{background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:14px;cursor:pointer;transition:all .2s}
  .rc:hover{border-color:var(--border2);background:var(--bg3)} 
  .rc.sel{border-color:rgba(255,140,89,.35)!important;background:var(--bg3)!important;box-shadow:0 0 0 1px rgba(255,140,89,.1)}

  /* ── Sidebar nav ── */
  .nav{background:none;border:none;cursor:pointer;padding:10px 14px;font-family:'Plus Jakarta Sans',sans-serif;font-size:11px;font-weight:500;letter-spacing:.3px;color:var(--muted);transition:all .2s;width:100%;text-align:left;border-radius:10px;display:flex;align-items:center;gap:10px}
  .nav:hover{background:var(--bg3);color:var(--text)} 
  .nav.on{background:rgba(255,140,89,.1)!important;color:var(--orange)!important;border-left:2px solid var(--orange);padding-left:12px}

  /* ── Toggle ── */
  .tog{position:relative;display:inline-block;width:44px;height:24px;flex-shrink:0}
  .tog input{opacity:0;width:0;height:0}
  .sli{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background:var(--bg3);border-radius:24px;transition:.3s;border:1px solid var(--border)}
  .sli:before{position:absolute;content:"";height:16px;width:16px;left:3px;bottom:3px;background:var(--muted2);border-radius:50%;transition:.3s}
  input:checked+.sli{background:rgba(255,140,89,.2);border-color:rgba(255,140,89,.4)} 
  input:checked+.sli:before{transform:translateX(20px);background:var(--orange)}

  /* ── Insight item ── */
  .ip{display:flex;align-items:flex-start;gap:8px;padding:11px 13px;border-radius:10px;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;line-height:1.5;margin-bottom:8px;width:100%}

  /* ── Period filter ── */
  .period-btn{background:var(--bg2);border:1px solid var(--border);border-radius:8px;padding:7px 13px;font-family:'Plus Jakarta Sans',sans-serif;font-size:11px;font-weight:500;color:var(--muted);cursor:pointer;display:flex;align-items:center;gap:8px;transition:all .2s;white-space:nowrap}
  .period-btn:hover{border-color:var(--border2);color:var(--text)}
  .period-btn.active-period{border-color:rgba(255,140,89,.3);color:var(--orange);background:rgba(255,140,89,.06)}
  .period-dropdown{position:absolute;top:calc(100% + 8px);right:0;background:var(--bg3);border:1px solid var(--border);border-radius:12px;overflow:hidden;z-index:100;min-width:200px;box-shadow:0 8px 32px rgba(0,0,0,.6)}
  .period-opt{display:block;width:100%;background:none;border:none;text-align:left;padding:10px 16px;font-family:'Plus Jakarta Sans',sans-serif;font-size:11px;font-weight:500;color:var(--muted);cursor:pointer;transition:all .15s}
  .period-opt:hover{background:rgba(255,140,89,.08);color:var(--orange)}
  .period-opt.sel-opt{color:var(--orange);background:rgba(255,140,89,.05)}
  .custom-date-row{display:flex;gap:8px;padding:10px 14px;border-top:1px solid var(--border);background:var(--bg2)}

  /* ── Auth inputs ── */
  .auth-input{background:var(--bg2)!important;border:1px solid var(--border)!important;border-radius:10px!important;color:var(--text)!important;font-family:'Plus Jakarta Sans',sans-serif!important;font-size:13px!important;padding:13px 16px!important;outline:none!important;transition:border-color .2s,box-shadow .2s!important;width:100%!important}
  .auth-input:focus{border-color:var(--orange)!important;box-shadow:0 0 0 3px rgba(255,140,89,.1)!important}
  .auth-input.err{border-color:rgba(239,68,68,.5)!important}
  .auth-btn{width:100%;padding:14px;background:var(--grad);border:none;border-radius:10px;color:#fff;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all .2s;margin-top:4px}
  .auth-btn:hover{opacity:.9;transform:translateY(-1px);box-shadow:0 6px 24px rgba(255,140,89,.3)}
  .auth-btn:active{transform:translateY(0)} .auth-btn:disabled{opacity:.4;cursor:not-allowed;transform:none}
  .auth-link{background:none;border:none;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;font-size:11px;color:var(--orange);text-decoration:underline;text-decoration-color:rgba(255,140,89,.3);transition:color .2s}
  .auth-link:hover{color:var(--orange2)}
  .field-err{font-family:'Plus Jakarta Sans',sans-serif;font-size:11px;color:var(--red);margin-top:5px}

  /* ── Toasts ── */
  .success-toast{position:fixed;top:24px;right:24px;background:var(--grad2);color:#fff;font-family:'Plus Jakarta Sans',sans-serif;font-size:11px;font-weight:600;padding:10px 18px;border-radius:8px;z-index:9999;animation:fi .3s ease;box-shadow:0 4px 20px rgba(124,166,58,.3)}
  .error-toast{position:fixed;top:24px;right:24px;background:var(--red);color:#fff;font-family:'Plus Jakarta Sans',sans-serif;font-size:11px;font-weight:600;padding:10px 18px;border-radius:8px;z-index:9999;animation:fi .3s ease}

  /* ── Modal animations ── */
  @keyframes modalIn{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}} .modal-in{animation:modalIn .2s cubic-bezier(.16,1,.3,1)}
  @keyframes overlayIn{from{opacity:0}to{opacity:1}} .overlay-in{animation:overlayIn .2s ease}

  /* ── Google button ── */
  .goog-btn{display:flex;align-items:center;gap:12px;width:100%;padding:14px 18px;background:#fff;border:1.5px solid #dadce0;border-radius:10px;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;font-size:12px;font-weight:500;color:#3c4043;transition:all .2s;justify-content:center}
  .goog-btn:hover{background:#f8f9fa;box-shadow:0 2px 16px rgba(0,0,0,.12);border-color:#c6c9cc}

  /* ── Perm / delete ── */
  .perm-row{display:flex;align-items:flex-start;gap:12px;padding:12px 0;border-bottom:1px solid var(--border)}
  .perm-row:last-child{border-bottom:none}
  .del-input{background:var(--bg)!important;border:1px solid rgba(239,68,68,.3)!important;border-radius:10px!important;color:var(--text)!important;font-family:'Plus Jakarta Sans',sans-serif!important;font-size:12px!important;padding:12px 14px!important;outline:none!important;width:100%!important;transition:border-color .2s!important}
  .del-input:focus{border-color:var(--red)!important}

  /* ── Loading ── */
  .loading-screen{min-height:100vh;background:var(--bg);display:flex;align-items:center;justify-content:center}
  .loading-dot{width:8px;height:8px;border-radius:50%;background:var(--orange);animation:pulse 1.4s ease-in-out infinite}

  /* ── Keyframes ── */
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
  @keyframes fi{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  @keyframes sp{to{transform:rotate(360deg)}} .sp{animation:sp 1s linear infinite;display:inline-block}
  @keyframes authIn{from{opacity:0;transform:translateY(20px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}} .auth-in{animation:authIn .45s cubic-bezier(.16,1,.3,1)}

  /* ── Gradient text util ── */
  .grad-text{background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}

  /* ── Glow card ── */
  .glow-card{position:relative;overflow:hidden}
  .glow-card::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 50% 0%,rgba(255,140,89,.06),transparent 60%);pointer-events:none}
`;

// ─── Shared UI Components ─────────────────────────────────────────────────────
const Stars = ({rating, size=14}) => (
  <span style={{display:"inline-flex",gap:1}}>
    {[1,2,3,4,5].map(s=>(
      <svg key={s} width={size} height={size} viewBox="0 0 24 24" fill={s<=rating?"#fbbf24":"var(--border2)"}>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ))}
  </span>
);
const SC = {positive:"#34d399",neutral:"#fbbf24",negative:"#f87171"};
const SB = {positive:"rgba(52,211,153,.1)",neutral:"rgba(251,191,36,.1)",negative:"rgba(248,113,113,.1)"};
const Label = ({children, color}) => (
  <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:9,color:color||"var(--muted2)",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:7}}>{children}</div>
);
const Card = ({children, style}) => (
  <div style={{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:10,padding:"22px 26px",marginBottom:18,...style}}>{children}</div>
);

const AuthBG = () => (
  <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
    <div style={{position:"absolute",top:"-10%",right:"-5%",width:"55vw",height:"55vw",borderRadius:"50%",background:"radial-gradient(circle,rgba(255,140,89,.09) 0%,transparent 65%)",filter:"blur(50px)"}}/>
    <div style={{position:"absolute",bottom:"-10%",left:"-5%",width:"40vw",height:"40vw",borderRadius:"50%",background:"radial-gradient(circle,rgba(124,166,58,.08) 0%,transparent 65%)",filter:"blur(50px)"}}/>
    <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:.05}} xmlns="http://www.w3.org/2000/svg">
      <defs><pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="rgba(255,140,89,.9)"/></pattern></defs>
      <rect width="100%" height="100%" fill="url(#dots)"/>
    </svg>
  </div>
);

const AuthLogo = () => (
  <div style={{textAlign:"center",marginBottom:32}}>
    <div style={{display:"inline-flex",flexDirection:"column",alignItems:"center",gap:2}}>
      <div style={{display:"flex",gap:6,alignItems:"baseline"}}>
        <span className="grad-text" style={{fontFamily:"'Syne',sans-serif",fontSize:32,fontWeight:700,letterSpacing:2}}>Review</span>
        <span style={{fontFamily:"'Syne',sans-serif",fontSize:32,fontWeight:700,color:"var(--text)",letterSpacing:2}}>Copilot</span>
      </div>
      <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:8,color:"var(--muted2)",letterSpacing:3,textTransform:"uppercase"}}>AI-Powered · Google Reviews</div>
    </div>
  </div>
);

function Modal({ onClose, children, danger }) {
  return (
    <div className="overlay-in" style={{position:"fixed",inset:0,background:"rgba(0,0,0,.75)",backdropFilter:"blur(4px)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}
      onClick={e=>{ if(e.target===e.currentTarget) onClose(); }}>
      <div className="modal-in" style={{background:"var(--bg2)",border:`1px solid ${danger?"rgba(239,68,68,.2)":"var(--border2)"}`,borderRadius:14,padding:"32px",maxWidth:440,width:"100%",position:"relative"}}>
        <button onClick={onClose} style={{position:"absolute",top:16,right:16,background:"none",border:"none",cursor:"pointer",color:"var(--muted)",fontSize:18,lineHeight:1}}>×</button>
        {children}
      </div>
    </div>
  );
}

// ─── Password strength ────────────────────────────────────────────────────────
function pwStrength(p) {
  if(!p) return 0;
  let s = 0;
  if(p.length>=8) s++;
  if(/[A-Z]/.test(p)) s++;
  if(/[0-9]/.test(p)) s++;
  if(/[^A-Za-z0-9]/.test(p)) s++;
  return s;
}
const PW_COLORS = ["var(--red)","var(--red)","#fbbf24","var(--teal)","var(--teal)"];
const PW_LABELS = ["","Weak","Fair","Good","Strong"];

// ─── Time periods ─────────────────────────────────────────────────────────────
const TIME_PERIODS = [
  {label:"Last 1 Week",days:7},{label:"Last 2 Weeks",days:14},{label:"Last Month",days:30},
  {label:"Last 3 Months",days:90},{label:"Last 6 Months",days:180},{label:"Last 1 Year",days:365},
  {label:"All Time",days:9999},{label:"Custom Date",days:null},
];
function filterByPeriod(reviews, period, from, to) {
  const now = new Date();
  return reviews.filter(r => {
    const d = new Date(r.created_at);
    if(period.days===9999) return true;
    if(period.days!==null){ const c=new Date(now); c.setDate(c.getDate()-period.days); return d>=c; }
    const f=from?new Date(from):new Date(0), t=to?new Date(to):now;
    return d>=f && d<=t;
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// AUTH SCREENS  (use Supabase Auth)
// ═══════════════════════════════════════════════════════════════════════════════

function LoginScreen({ onGoSignup, onGoForgot }) {
  const [email, setEmail]   = useState("");
  const [pw, setPw]         = useState("");
  const [showPw, setShowPw] = useState(false);
  const [err, setErr]       = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setErr("");
    if(!email.trim()) return setErr("Email is required.");
    if(!pw) return setErr("Password is required.");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password: pw });
    if(error) {
      setErr(error.message === "Invalid login credentials" ? "Incorrect email or password." : error.message);
    }
    setLoading(false);
    // On success, onAuthStateChange in root App handles the redirect
  };

  return (
    <div style={{minHeight:"100vh",background:"var(--bg)",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
      <style>{GLOBAL_CSS}</style>
      <AuthBG/>
      <div className="auth-in" style={{width:"100%",maxWidth:420,padding:"0 24px",position:"relative",zIndex:1}}>
        <AuthLogo/>
        <div style={{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:18,padding:"36px 36px 32px"}}>
          <div style={{marginBottom:28}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:24,fontWeight:300,color:"var(--text)",marginBottom:6}}>Welcome back</div>
            <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:10,color:"var(--muted2)",letterSpacing:.5}}>Sign in to your account to continue</div>
          </div>
          {err&&<div className="fi" style={{marginBottom:16,padding:"10px 14px",background:"rgba(239,68,68,.06)",border:"1px solid #ef444430",borderRadius:7,display:"flex",alignItems:"center",gap:8}}><span style={{color:"var(--red)",fontSize:12}}>⚠</span><span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:10,color:"var(--red)"}}>{err}</span></div>}
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div>
              <Label>Email Address</Label>
              <input className="auth-input" type="email" placeholder="you@business.com" value={email} onChange={e=>{setEmail(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&submit()}/>
            </div>
            <div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:7}}>
                <Label>Password</Label>
                <button className="auth-link" onClick={onGoForgot} style={{fontSize:9}}>Forgot password?</button>
              </div>
              <div style={{position:"relative"}}>
                <input className="auth-input" type={showPw?"text":"password"} placeholder="Enter your password" value={pw} onChange={e=>{setPw(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&submit()} style={{paddingRight:42}}/>
                <button onClick={()=>setShowPw(s=>!s)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"var(--muted)",fontSize:12,padding:2}}>{showPw?"🙈":"👁"}</button>
              </div>
            </div>
          </div>
          <button className="auth-btn" onClick={submit} disabled={loading} style={{marginTop:22}}>
            {loading?<><span className="sp" style={{marginRight:7,fontSize:10}}>◌</span>Signing in…</>:"Sign In"}
          </button>
          <div style={{textAlign:"center",marginTop:22,fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:10,color:"var(--muted2)"}}>
            Don't have an account?{" "}<button className="auth-link" onClick={onGoSignup}>Create one</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SignupScreen({ onGoLogin }) {
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [biz, setBiz]         = useState("");
  const [bizType, setBizType] = useState("");
  const [pw, setPw]           = useState("");
  const [pw2, setPw2]         = useState("");
  const [showPw, setShowPw]   = useState(false);
  const [agree, setAgree]     = useState(false);
  const [errs, setErrs]       = useState({});
  const [loading, setLoading] = useState(false);

  const strength = pwStrength(pw);

  const validate = () => {
    const e = {};
    if(!name.trim())  e.name  = "Full name is required.";
    if(!email.trim()) e.email = "Email is required.";
    else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email.";
    if(!biz.trim())   e.biz   = "Business name is required.";
    if(!pw)           e.pw    = "Password is required.";
    else if(pw.length<8) e.pw = "At least 8 characters required.";
    else if(strength<2)  e.pw = "Password is too weak.";
    if(pw!==pw2)      e.pw2   = "Passwords do not match.";
    if(!agree)        e.agree = "Please accept the terms.";
    return e;
  };

  const submit = async () => {
    const e = validate();
    if(Object.keys(e).length){ setErrs(e); return; }
    setErrs({});
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password: pw,
      options: {
        data: { name: name.trim(), biz: biz.trim(), biz_type: bizType.trim() || "Business" }
      }
    });
    if(error) {
      setErrs({ email: error.message });
      setLoading(false);
      return;
    }
    // Profile row is created by Supabase trigger (see schema.sql)
    // onAuthStateChange in root App will fire and route to google-connect
    setLoading(false);
  };

  return (
    <div style={{minHeight:"100vh",background:"var(--bg)",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",fontFamily:"'Plus Jakarta Sans',sans-serif",padding:"24px 0"}}>
      <style>{GLOBAL_CSS}</style>
      <AuthBG/>
      <div className="auth-in" style={{width:"100%",maxWidth:460,padding:"0 24px",position:"relative",zIndex:1}}>
        <AuthLogo/>
        <div style={{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:18,padding:"36px 36px 32px"}}>
          <div style={{marginBottom:28}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:24,fontWeight:300,color:"var(--text)",marginBottom:6}}>Create your account</div>
            <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:10,color:"var(--muted2)",letterSpacing:.5}}>Start managing your Google reviews with AI</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div>
                <Label>Full Name</Label>
                <input className={`auth-input${errs.name?" err":""}`} placeholder="Jane Smith" value={name} onChange={e=>{setName(e.target.value);setErrs(p=>({...p,name:""}));}}/>
                {errs.name&&<div className="field-err">{errs.name}</div>}
              </div>
              <div>
                <Label>Email</Label>
                <input className={`auth-input${errs.email?" err":""}`} type="email" placeholder="you@business.com" value={email} onChange={e=>{setEmail(e.target.value);setErrs(p=>({...p,email:""}));}}/>
                {errs.email&&<div className="field-err">{errs.email}</div>}
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div>
                <Label>Business Name</Label>
                <input className={`auth-input${errs.biz?" err":""}`} placeholder="Bella Vista Café" value={biz} onChange={e=>{setBiz(e.target.value);setErrs(p=>({...p,biz:""}));}}/>
                {errs.biz&&<div className="field-err">{errs.biz}</div>}
              </div>
              <div>
                <Label>Business Type <span style={{color:"var(--muted2)"}}>(optional)</span></Label>
                <input className="auth-input" placeholder="Restaurant, Salon…" value={bizType} onChange={e=>setBizType(e.target.value)}/>
              </div>
            </div>
            <div>
              <Label>Password</Label>
              <div style={{position:"relative"}}>
                <input className={`auth-input${errs.pw?" err":""}`} type={showPw?"text":"password"} placeholder="Min. 8 characters" value={pw} onChange={e=>{setPw(e.target.value);setErrs(p=>({...p,pw:""}));}} style={{paddingRight:42}}/>
                <button onClick={()=>setShowPw(s=>!s)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"var(--muted)",fontSize:12,padding:2}}>{showPw?"🙈":"👁"}</button>
              </div>
              {pw&&(
                <div style={{marginTop:7}}>
                  <div style={{display:"flex",gap:3}}>{[1,2,3,4].map(i=>(<div key={i} style={{flex:1,height:3,borderRadius:2,background:i<=strength?PW_COLORS[strength]:"var(--border2)",transition:"background .3s"}}/>))}</div>
                  {strength>0&&<div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:8,color:PW_COLORS[strength],marginTop:4,letterSpacing:.5}}>{PW_LABELS[strength]}</div>}
                </div>
              )}
              {errs.pw&&<div className="field-err">{errs.pw}</div>}
            </div>
            <div>
              <Label>Confirm Password</Label>
              <input className={`auth-input${errs.pw2?" err":""}`} type="password" placeholder="Repeat your password" value={pw2} onChange={e=>{setPw2(e.target.value);setErrs(p=>({...p,pw2:""}));}}/>
              {errs.pw2&&<div className="field-err">{errs.pw2}</div>}
            </div>
            <div style={{display:"flex",alignItems:"flex-start",gap:10,padding:"12px 14px",background:errs.agree?"rgba(239,68,68,.04)":"var(--bg)",border:`1px solid ${errs.agree?"rgba(239,68,68,.2)":"var(--border)"}`,borderRadius:8,cursor:"pointer"}} onClick={()=>{setAgree(a=>!a);setErrs(p=>({...p,agree:""}));}}>
              <div style={{width:16,height:16,borderRadius:4,border:`1px solid ${agree?"var(--orange)":"var(--border2)"}`,background:agree?"var(--orange)":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1,transition:"all .2s"}}>
                {agree&&<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--bg)" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
              </div>
              <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:9,color:"var(--muted)",lineHeight:1.7}}>I agree to the <span style={{color:"var(--orange)"}}>Terms of Service</span> and <span style={{color:"var(--orange)"}}>Privacy Policy</span></div>
            </div>
            {errs.agree&&<div className="field-err" style={{marginTop:-8}}>{errs.agree}</div>}
          </div>
          <button className="auth-btn" onClick={submit} disabled={loading} style={{marginTop:22}}>
            {loading?<><span className="sp" style={{marginRight:7,fontSize:10}}>◌</span>Creating account…</>:"Create Account"}
          </button>
          <div style={{textAlign:"center",marginTop:22,fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:10,color:"var(--muted2)"}}>
            Already have an account?{" "}<button className="auth-link" onClick={onGoLogin}>Sign in</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ForgotScreen({ onGoLogin }) {
  const [email, setEmail]     = useState("");
  const [sent, setSent]       = useState(false);
  const [err, setErr]         = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if(!email.trim()) return setErr("Email is required.");
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`
    });
    if(error) { setErr(error.message); setLoading(false); return; }
    setSent(true);
    setLoading(false);
  };

  return (
    <div style={{minHeight:"100vh",background:"var(--bg)",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
      <style>{GLOBAL_CSS}</style>
      <AuthBG/>
      <div className="auth-in" style={{width:"100%",maxWidth:400,padding:"0 24px",position:"relative",zIndex:1}}>
        <AuthLogo/>
        <div style={{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:18,padding:"36px 36px 32px"}}>
          {!sent ? (
            <>
              <div style={{marginBottom:28}}>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:24,fontWeight:300,color:"var(--text)",marginBottom:6}}>Reset password</div>
                <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:10,color:"var(--muted2)",letterSpacing:.5}}>We'll send a reset link to your email</div>
              </div>
              {err&&<div className="fi" style={{marginBottom:16,padding:"10px 14px",background:"rgba(239,68,68,.06)",border:"1px solid #ef444430",borderRadius:7}}><span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:10,color:"var(--red)"}}>{err}</span></div>}
              <Label>Email Address</Label>
              <input className="auth-input" type="email" placeholder="you@business.com" value={email} onChange={e=>{setEmail(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&submit()}/>
              <button className="auth-btn" onClick={submit} disabled={loading} style={{marginTop:20}}>
                {loading?<><span className="sp" style={{marginRight:7,fontSize:10}}>◌</span>Sending…</>:"Send Reset Link"}
              </button>
            </>
          ) : (
            <div className="fi" style={{textAlign:"center",padding:"10px 0"}}>
              <div style={{fontSize:40,marginBottom:16}}>✉</div>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:300,color:"var(--teal)",marginBottom:10}}>Check your inbox</div>
              <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:10,color:"var(--muted)",lineHeight:1.8}}>A reset link has been sent to<br/><span style={{color:"var(--orange)"}}>{email}</span></div>
            </div>
          )}
          <div style={{textAlign:"center",marginTop:24,fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:10,color:"var(--muted2)"}}>
            <button className="auth-link" onClick={onGoLogin}>← Back to sign in</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// GOOGLE CONNECT SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
const GOOGLE_PERMISSIONS = [
  {icon:"⭐",color:"#fbbf24",title:"Read your Google reviews",desc:"Access all reviews posted on your Google Business Profile in real time."},
  {icon:"✏",color:"#818cf8",title:"Post replies on your behalf",desc:"Allow the copilot to publish AI-generated replies directly to Google."},
  {icon:"🏢",color:"var(--teal)",title:"View business profile info",desc:"Read your business name, address, category and operating hours."},
  {icon:"📊",color:"var(--orange)",title:"Access review analytics",desc:"Retrieve rating history and review trends to power insights."},
];

function GoogleConnectScreen({ profile, onConnected, onSkip }) {
  const [step, setStep]       = useState("intro");
  const [progress, setProgress] = useState(0);

  const startAuth = () => {
    setStep("authorizing");
    setProgress(0);
    const popup = window.open("about:blank","_blank","width=520,height=620,left=400,top=100");
    if(popup){
      popup.document.write(`<html><head><title>Sign in with Google</title>
        <style>body{font-family:Arial,sans-serif;background:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;margin:0;color:#3c4043}
        h2{font-size:20px;font-weight:400;margin:0 0 8px} p{font-size:14px;color:#5f6368;margin:0 0 32px;text-align:center}
        .acct{display:flex;align-items:center;gap:12px;padding:14px 20px;border:1px solid #dadce0;border-radius:10px;cursor:pointer;margin-bottom:12px;width:320px;transition:background .2s}
        .acct:hover{background:#f8f9fa} .avatar{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#4285f4,#34a853);display:flex;align-items:center;justify-content:center;color:#fff;font-size:14px;font-weight:600}
        .info{text-align:left} .name{font-size:14px;font-weight:500} .email{font-size:12px;color:#5f6368}
        .btn{width:320px;padding:12px;background:#1a73e8;color:#fff;border:none;border-radius:6px;font-size:14px;cursor:pointer}
        .btn:hover{background:#1557b0}</style></head><body>
        <div style="font-size:32px;margin-bottom:16px">G</div>
        <h2>Sign in with Google</h2>
        <p>Review Copilot wants to access<br>your Google Business Profile</p>
        <div class="acct" onclick="window.close()">
          <div class="avatar">${(profile?.name||"U")[0].toUpperCase()}</div>
          <div class="info"><div class="name">${profile?.name||""}</div><div class="email">${profile?.email||""}</div></div>
        </div>
        <button class="btn" onclick="window.close()">Allow access</button>
        </body></html>`);
    }
    let p = 0;
    const iv = setInterval(()=>{
      p += Math.random()*12;
      if(p>=100){ p=100; clearInterval(iv); setTimeout(()=>setStep("success"),400); }
      setProgress(Math.min(p,100));
    },180);
    setTimeout(()=>{ clearInterval(iv); setProgress(100); setTimeout(()=>setStep("success"),400); },3500);
  };

  const finish = async () => {
    // Store google_connected = true on the profile row in Supabase
    await supabase.from("profiles").update({
      google_connected: true,
      google_account: profile?.email || "",
      google_connected_at: new Date().toISOString(),
    }).eq("id", profile?.id);
    onConnected();
  };

  return (
    <div style={{minHeight:"100vh",background:"var(--bg)",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",fontFamily:"'Plus Jakarta Sans',sans-serif",padding:"24px 0"}}>
      <style>{GLOBAL_CSS}</style>
      <AuthBG/>
      <div className="auth-in" style={{width:"100%",maxWidth:500,padding:"0 24px",position:"relative",zIndex:1}}>
        <AuthLogo/>
        {step==="intro"&&(
          <div style={{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:18,padding:"36px 36px 32px"}}>
            <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:28}}>
              <div style={{width:52,height:52,borderRadius:14,background:"linear-gradient(135deg,#4285f430,#34a85330)",border:"1px solid #4285f440",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>G</div>
              <div>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:300,color:"var(--text)"}}>Connect Google Business</div>
                <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:9,color:"var(--muted2)",marginTop:3}}>One-time setup · takes 30 seconds</div>
              </div>
            </div>
            <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:9,color:"var(--muted)",letterSpacing:1,textTransform:"uppercase",marginBottom:14}}>Permissions requested</div>
            <div style={{background:"var(--bg)",border:"1px solid var(--border)",borderRadius:10,padding:"6px 16px",marginBottom:24}}>
              {GOOGLE_PERMISSIONS.map((p,i)=>(
                <div key={i} className="perm-row">
                  <div style={{width:32,height:32,borderRadius:8,background:`${p.color}15`,border:`1px solid ${p.color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>{p.icon}</div>
                  <div><div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:10,color:"#b0b4cc",marginBottom:3}}>{p.title}</div><div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:9,color:"var(--muted)",lineHeight:1.6}}>{p.desc}</div></div>
                </div>
              ))}
            </div>
            <div style={{padding:"12px 16px",background:"rgba(255,140,89,.04)",border:"1px solid #c8a96e20",borderRadius:8,marginBottom:24,fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:9,color:"rgba(255,140,89,.5)",lineHeight:1.7}}>
              🔒 Handled securely via Google OAuth 2.0. Review Copilot never stores your Google password.
            </div>
            <button className="goog-btn" onClick={startAuth}>
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continue with Google
            </button>
            <div style={{textAlign:"center",marginTop:20}}>
              <button className="auth-link" onClick={onSkip} style={{fontSize:9,color:"var(--muted2)"}}>Skip for now — connect later in Settings</button>
            </div>
          </div>
        )}
        {step==="authorizing"&&(
          <div className="fi" style={{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:18,padding:"48px 36px",textAlign:"center"}}>
            <div style={{fontSize:40,marginBottom:20}}>G</div>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:300,color:"var(--text)",marginBottom:8}}>Connecting to Google…</div>
            <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:9,color:"var(--muted)",marginBottom:28}}>Complete authorization in the popup window</div>
            <div style={{height:4,background:"var(--border)",borderRadius:2,overflow:"hidden",marginBottom:12}}>
              <div style={{height:"100%",width:`${progress}%`,background:"linear-gradient(90deg,#4285f4,#34a853,#c8a96e)",borderRadius:2,transition:"width .2s ease"}}/>
            </div>
            <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:9,color:"var(--muted2)"}}>{Math.round(progress)}% complete</div>
          </div>
        )}
        {step==="success"&&(
          <div className="fi" style={{background:"var(--bg2)",border:"1px solid #10b98130",borderRadius:18,padding:"48px 36px",textAlign:"center"}}>
            <div style={{width:64,height:64,borderRadius:"50%",background:"rgba(52,211,153,.13)",border:"2px solid #10b98140",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,margin:"0 auto 20px"}}>✓</div>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:26,fontWeight:300,color:"var(--teal)",marginBottom:8}}>Connected!</div>
            <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:10,color:"var(--muted)",marginBottom:24}}>Google Business Profile linked successfully</div>
            <button className="auth-btn" onClick={finish} style={{marginTop:0}}>Go to Dashboard →</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════════
function MainApp({ session, profile: initialProfile, onLogout }) {
  const [profile, setProfile]   = useState(initialProfile);
  const [reviews, setReviews]   = useState([]);
  const [revLoading, setRevLoading] = useState(true);

  const [view, setView]             = useState("dashboard");
  const [activeTab, setActiveTab]   = useState("all");
  const [selected, setSelected]     = useState(null);
  const [genReply, setGenReply]     = useState("");
  const [editReply, setEditReply]   = useState("");
  const [isGen, setIsGen]           = useState(false);
  const [tone, setTone]             = useState("professional");
  const [biz, setBiz]               = useState(profile?.biz || "");
  const [bizType, setBizType]       = useState(profile?.biz_type || "");
  const [dots, setDots]             = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [toast, setToast]           = useState("");
  const [toastType, setToastType]   = useState("success");

  const [gPeriod, setGPeriod]   = useState(TIME_PERIODS[6]);
  const [gFrom, setGFrom]       = useState("");
  const [gTo, setGTo]           = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [iPeriod, setIPeriod]   = useState(TIME_PERIODS[2]);
  const [iFrom, setIFrom]       = useState("");
  const [iTo, setITo]           = useState("");
  const [iData, setIData]       = useState(null);
  const [iLoading, setILoading] = useState(false);

  const [nEmail, setNEmail]     = useState(session?.user?.email || "");
  const [nEnabled, setNEnabled] = useState(false);
  const [nNeg, setNNeg]         = useState(true);
  const [nNeu, setNNeu]         = useState(false);
  const [nAll, setNAll]         = useState(false);
  const [nSaved, setNSaved]     = useState(false);

  const [arEnabled, setArEnabled] = useState(false);
  const [arPos, setArPos]         = useState(true);
  const [arNeu, setArNeu]         = useState(false);
  const [arNeg, setArNeg]         = useState(false);
  const [arTone, setArTone]       = useState("professional");
  const [arSaved, setArSaved]     = useState(false);
  const [arRunning, setArRunning] = useState(false);
  const [arLog, setArLog]         = useState([]);

  const [showReconnectScreen, setShowReconnectScreen] = useState(false);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal]         = useState(false);
  const [deleteConfirmText, setDeleteConfirmText]     = useState("");
  const [deleteLoading, setDeleteLoading]             = useState(false);

  const showToast = (msg, type="success") => { setToastType(type); setToast(msg); setTimeout(()=>setToast(""),3000); };

  // ── Load reviews from Supabase ──────────────────────────────────────────────
  const loadReviews = useCallback(async () => {
    setRevLoading(true);
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });
    if(!error) setReviews(data || []);
    setRevLoading(false);
  }, [session.user.id]);

  useEffect(() => { loadReviews(); }, [loadReviews]);

  // ── Dots animation ──────────────────────────────────────────────────────────
  useEffect(()=>{
    if(!isGen) return;
    const i = setInterval(()=>setDots(d=>d.length>=3?"":d+"."),400);
    return ()=>clearInterval(i);
  },[isGen]);

  // ── Close dropdowns on outside click ───────────────────────────────────────
  useEffect(()=>{
    if(!showDatePicker) return;
    const h=(e)=>{ if(!e.target.closest(".period-dropdown")&&!e.target.closest(".period-btn")) setShowDatePicker(false); };
    document.addEventListener("mousedown",h); return()=>document.removeEventListener("mousedown",h);
  },[showDatePicker]);
  useEffect(()=>{
    if(!showUserMenu) return;
    const h=(e)=>{ if(!e.target.closest(".user-menu")) setShowUserMenu(false); };
    document.addEventListener("mousedown",h); return()=>document.removeEventListener("mousedown",h);
  },[showUserMenu]);

  // ── Computed values ─────────────────────────────────────────────────────────
  const periodReviews = filterByPeriod(reviews, gPeriod, gFrom, gTo);
  const filtered = periodReviews.filter(r=>{
    if(activeTab==="all") return true;
    if(activeTab==="flagged") return r.flagged;
    if(activeTab==="unreplied") return !r.replied;
    if(activeTab==="replied") return r.replied;
    return true;
  });
  const stats = {
    avg:       periodReviews.length?(periodReviews.reduce((a,r)=>a+r.rating,0)/periodReviews.length).toFixed(1):"—",
    total:     periodReviews.length,
    positive:  periodReviews.filter(r=>r.sentiment==="positive").length,
    negative:  periodReviews.filter(r=>r.sentiment==="negative").length,
    unreplied: periodReviews.filter(r=>!r.replied).length,
    flagged:   periodReviews.filter(r=>r.flagged).length,
  };

  // ── AI call via secure proxy ────────────────────────────────────────────────
  const callClaude = async (system, user_, maxTokens=1000) => {
    const res = await fetch("/api/claude", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:maxTokens, system, messages:[{role:"user",content:user_}] })
    });
    if(!res.ok) { const e=await res.json().catch(()=>({})); throw new Error(e.error||`API error ${res.status}`); }
    const data = await res.json();
    return data.content?.[0]?.text || "";
  };

  // ── Review actions (write to Supabase) ──────────────────────────────────────
  const generateReply = async (review) => {
    setIsGen(true); setGenReply(""); setEditReply("");
    try {
      const t = await callClaude(
        `You are a ${tone} customer service expert for ${biz||"this business"}, a ${bizType||"business"}. Write a concise genuine Google review response (2-4 sentences). Be specific. Never say "We value your feedback." Sign off with the business name. ONLY the reply text, nothing else.`,
        `Write a response to this ${review.rating}-star review: "${review.text}"`
      );
      setGenReply(t); setEditReply(t);
    } catch(e) { setGenReply(`Error: ${e.message}`); setEditReply(""); }
    setIsGen(false);
  };

  const sendReply = async () => {
    const { error } = await supabase.from("reviews")
      .update({ replied: true, reply: editReply, replied_at: new Date().toISOString() })
      .eq("id", selected.id);
    if(error) { showToast("Failed to save reply", "error"); return; }
    const updated = {...selected, replied:true, reply:editReply};
    setReviews(p=>p.map(r=>r.id===selected.id ? updated : r));
    setSelected(updated);
    setGenReply(""); setEditReply("");
    showToast("✓ Reply posted");
  };

  const toggleFlag = async (id) => {
    const rev = reviews.find(r=>r.id===id);
    const newVal = !rev.flagged;
    await supabase.from("reviews").update({ flagged: newVal }).eq("id", id);
    setReviews(p=>p.map(r=>r.id===id?{...r,flagged:newVal}:r));
    if(selected?.id===id) setSelected(p=>({...p,flagged:newVal}));
  };

  const addTestReview = async () => {
    const sample = {
      user_id: session.user.id,
      author: "Test Customer",
      avatar: "TC",
      rating: 5,
      text: "Great service and wonderful atmosphere! The staff were incredibly attentive and the quality was top notch. Will definitely return.",
      replied: false,
      flagged: false,
      sentiment: "positive",
      created_at: new Date().toISOString(),
    };
    const { data, error } = await supabase.from("reviews").insert(sample).select().single();
    if(!error && data) setReviews(p=>[data,...p]);
    else showToast("Could not add review", "error");
  };

  const generateInsights = async () => {
    const subset = filterByPeriod(reviews, iPeriod, iFrom, iTo);
    if(!subset.length){ setIData({empty:true}); return; }
    setILoading(true); setIData(null);
    const rvText = subset.map(r=>`[${r.rating}★] ${r.author}: "${r.text}"`).join("\n");
    try {
      const raw = await callClaude(
        `You are a business intelligence analyst. Analyze Google reviews for ${biz||"this business"} (${bizType||"business"}) and return ONLY valid JSON with no markdown:
{"goingRight":["p1","p2","p3"],"goingWrong":["p1","p2","p3"],"improvements":["p1","p2","p3"],"summary":"2 sentence executive summary","topTheme":"5 words max","urgency":"low|medium|high"}`,
        `Analyze these ${subset.length} reviews:\n${rvText}`, 1500
      );
      const clean = raw.replace(/```json|```/g,"").trim();
      setIData({...JSON.parse(clean), count:subset.length, avgRating:(subset.reduce((a,r)=>a+r.rating,0)/subset.length).toFixed(1)});
    } catch { setIData({error:true}); }
    setILoading(false);
  };

  const runAutoReply = async () => {
    const types=[]; if(arPos) types.push("positive"); if(arNeu) types.push("neutral"); if(arNeg) types.push("negative");
    const candidates = reviews.filter(r=>!r.replied&&types.includes(r.sentiment)).slice(0,3);
    if(!candidates.length){ setArLog([{msg:"No unreplied reviews match selected types.",type:"info"}]); return; }
    setArRunning(true); setArLog([]);
    for(const rv of candidates){
      setArLog(l=>[...l,{msg:`Processing ${rv.author} (${rv.sentiment})…`,type:"info"}]);
      await new Promise(r=>setTimeout(r,500));
      try {
        const reply = await callClaude(
          `You are a ${arTone} customer service expert for ${biz||"this business"}. Write a concise Google review reply (2-3 sentences). Sign off as ${biz||"the team"}. ONLY the reply text.`,
          `Reply to this ${rv.rating}★ review: "${rv.text}"`, 400
        );
        await supabase.from("reviews").update({ replied:true, reply, replied_at:new Date().toISOString() }).eq("id",rv.id);
        setReviews(p=>p.map(r=>r.id===rv.id?{...r,replied:true,reply}:r));
        setArLog(l=>[...l,{msg:`✓ Auto-replied to ${rv.author}`,type:"success",preview:reply}]);
      } catch { setArLog(l=>[...l,{msg:`✗ Failed for ${rv.author}`,type:"error"}]); }
      await new Promise(r=>setTimeout(r,300));
    }
    setArRunning(false);
  };

  const saveProfile = async () => {
    const { data, error } = await supabase.from("profiles")
      .update({ biz, biz_type: bizType })
      .eq("id", session.user.id)
      .select().single();
    if(!error && data) { setProfile(data); showToast("✓ Profile saved"); }
    else showToast("Failed to save", "error");
  };

  const handleGoogleConnected = async () => {
    const { data } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
    if(data) setProfile(data);
    setShowReconnectScreen(false);
    showToast("✓ Google Business Profile connected");
  };

  const handleDisconnect = async () => {
    await supabase.from("profiles").update({ google_connected:false, google_account:"" }).eq("id", session.user.id);
    setProfile(p=>({...p, google_connected:false, google_account:""}));
    setShowDisconnectModal(false);
    showToast("Google account disconnected", "error");
  };

  const handleDeleteAccount = async () => {
    if(deleteConfirmText !== session.user.email) return;
    setDeleteLoading(true);
    // Delete all user data then the auth user
    await supabase.from("reviews").delete().eq("user_id", session.user.id);
    await supabase.from("profiles").delete().eq("id", session.user.id);
    await supabase.auth.admin?.deleteUser?.(session.user.id); // requires service key in edge fn
    await supabase.auth.signOut();
    setDeleteLoading(false);
  };

  const initials = (profile?.name||session?.user?.email||"U").split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2);

  if(showReconnectScreen){
    return <GoogleConnectScreen profile={{...profile, email:session.user.email}} onConnected={handleGoogleConnected} onSkip={()=>setShowReconnectScreen(false)}/>;
  }

  return (
    <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",background:"var(--bg)",minHeight:"100vh",color:"var(--text)",position:"relative"}}>
      <style>{GLOBAL_CSS}</style>
      {toast&&<div className={toastType==="error"?"error-toast":"success-toast"}>{toast}</div>}

      {showDisconnectModal&&(
        <Modal onClose={()=>setShowDisconnectModal(false)} danger>
          <div style={{textAlign:"center",marginBottom:24}}>
            <div style={{width:52,height:52,borderRadius:"50%",background:"rgba(239,68,68,.09)",border:"1px solid #ef444430",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,margin:"0 auto 16px"}}>⚠</div>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:300,color:"var(--red)",marginBottom:8}}>Disconnect Google Account?</div>
            <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:10,color:"var(--muted)",lineHeight:1.8}}>This will revoke Review Copilot's access to your Google Business Profile.</div>
          </div>
          <div style={{display:"flex",gap:10}}>
            <button className="btn ghost" style={{flex:1}} onClick={()=>setShowDisconnectModal(false)}>Cancel</button>
            <button className="btn red-btn" style={{flex:1}} onClick={handleDisconnect}>Yes, Disconnect</button>
          </div>
        </Modal>
      )}

      {showDeleteModal&&(
        <Modal onClose={()=>{setShowDeleteModal(false);setDeleteConfirmText("");}} danger>
          <div style={{textAlign:"center",marginBottom:24}}>
            <div style={{width:52,height:52,borderRadius:"50%",background:"rgba(239,68,68,.09)",border:"1px solid #ef444430",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,margin:"0 auto 16px"}}>🗑</div>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:300,color:"var(--red)",marginBottom:8}}>Delete Account</div>
            <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:10,color:"var(--muted)",lineHeight:1.8}}>This is permanent. All your data and reviews will be deleted.</div>
          </div>
          <div style={{marginBottom:20}}>
            <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:9,color:"var(--muted)",marginBottom:8}}>Type your email to confirm: <span style={{color:"var(--red)"}}>{session.user.email}</span></div>
            <input className="del-input" placeholder={session.user.email} value={deleteConfirmText} onChange={e=>setDeleteConfirmText(e.target.value)}/>
          </div>
          <div style={{display:"flex",gap:10}}>
            <button className="btn ghost" style={{flex:1}} onClick={()=>{setShowDeleteModal(false);setDeleteConfirmText("");}}>Cancel</button>
            <button className="btn" disabled={deleteConfirmText!==session.user.email||deleteLoading}
              style={{flex:1,background:deleteConfirmText===session.user.email?"var(--red)":"rgba(239,68,68,.13)",color:deleteConfirmText===session.user.email?"#fff":"rgba(239,68,68,.38)",border:"1px solid #ef444430",cursor:deleteConfirmText!==session.user.email?"not-allowed":"pointer",transition:"all .2s"}}
              onClick={handleDeleteAccount}>
              {deleteLoading?<><span className="sp" style={{marginRight:6,fontSize:9}}>◌</span>Deleting…</>:"Delete My Account"}
            </button>
          </div>
        </Modal>
      )}

      <div style={{display:"flex",height:"100vh"}}>
        {/* Sidebar */}
        <div style={{width:215,background:"var(--bg2)",borderRight:"1px solid var(--border)",display:"flex",flexDirection:"column",padding:"22px 10px",flexShrink:0}}>
          <div style={{padding:"0 8px 22px",borderBottom:"1px solid var(--border)"}}>
            <div className="grad-text" style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:700,letterSpacing:1}}>Review</div>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:700,color:"var(--text)",letterSpacing:1}}>Copilot</div>
            <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:8,color:"var(--muted2)",letterSpacing:2,marginTop:3}}>AI-POWERED</div>
          </div>
          <div style={{flex:1,padding:"14px 0"}}>
            {[
              {id:"dashboard",icon:"◈",label:"Dashboard"},
              {id:"reviews",  icon:"✦",label:"Reviews"},
              {id:"insights", icon:"◉",label:"Insights"},
              {id:"settings", icon:"⚙",label:"Settings"},
            ].map(item=>(
              <button key={item.id} className={`nav${view===item.id?" on":""}`} onClick={()=>setView(item.id)}>
                <span style={{fontSize:13}}>{item.icon}</span>{item.label}
              </button>
            ))}
          </div>
          <div style={{padding:"14px 8px 0",borderTop:"1px solid var(--border)"}}>
            {profile?.google_connected?(
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:12,padding:"8px 10px",background:"rgba(52,211,153,.06)",border:"1px solid #10b98120",borderRadius:7}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:"var(--teal)",flexShrink:0}}/>
                <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:8,color:"var(--teal)",lineHeight:1.4}}>Google Connected</div>
              </div>
            ):(
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:12,padding:"8px 10px",background:"rgba(251,191,36,.04)",border:"1px solid #f59e0b20",borderRadius:7,cursor:"pointer"}} onClick={()=>setShowReconnectScreen(true)}>
                <div style={{width:6,height:6,borderRadius:"50%",background:"#fbbf24",flexShrink:0}}/>
                <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:8,color:"#fbbf24",lineHeight:1.4}}>Connect Google →</div>
              </div>
            )}
            <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:9,color:"var(--muted2)",paddingLeft:6,marginBottom:4}}>{profile?.name||session.user.email}</div>
            <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:8,color:"var(--muted2)",paddingLeft:6,marginBottom:10}}>{biz||"No business set"}</div>
          </div>
        </div>

        {/* Main */}
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          {/* Header */}
          <div style={{padding:"16px 28px",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",justifyContent:"space-between",background:"var(--bg2)",flexShrink:0}}>
            <div>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:700,color:"var(--text)"}}>
                {{dashboard:"Dashboard",reviews:"Reviews",insights:"Business Insights",settings:"Settings"}[view]}
              </div>
              <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:9,color:"var(--muted2)",letterSpacing:1,marginTop:2}}>
                {{dashboard:"Google Review Management",reviews:`${stats.total} reviews · ${stats.unreplied} awaiting reply`,insights:"AI-powered analysis",settings:"Configure your copilot"}[view]}
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              {/* Global period filter */}
              <div style={{position:"relative"}}>
                <button className={`period-btn${gPeriod.days!==9999?" active-period":""}`} onClick={()=>setShowDatePicker(s=>!s)}>
                  ◷ {gPeriod.days===null?(gFrom&&gTo?`${gFrom} → ${gTo}`:"Custom"):gPeriod.label}
                </button>
                {showDatePicker&&(
                  <div className="period-dropdown">
                    {TIME_PERIODS.map(p=>(
                      <button key={p.label} className={`period-opt${gPeriod.label===p.label?" sel-opt":""}`}
                        onClick={()=>{ if(p.days!==null){ setGPeriod(p);setGFrom("");setGTo("");setShowDatePicker(false); } else setGPeriod(p); }}>
                        {p.label}
                      </button>
                    ))}
                    {gPeriod.days===null&&(
                      <div className="custom-date-row">
                        <input type="date" style={{flex:1,fontSize:9}} value={gFrom} onChange={e=>setGFrom(e.target.value)}/>
                        <input type="date" style={{flex:1,fontSize:9}} value={gTo} onChange={e=>setGTo(e.target.value)}/>
                        <button className="btn gold" style={{fontSize:8,padding:"5px 10px"}} onClick={()=>setShowDatePicker(false)}>Apply</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {/* User avatar */}
              <div className="user-menu" style={{position:"relative"}}>
                <button onClick={()=>setShowUserMenu(s=>!s)} style={{width:34,height:34,borderRadius:"50%",background:"linear-gradient(135deg,#c8a96e,#b8955a)",border:"none",cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:11,color:"var(--bg)",fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  {initials}
                </button>
                {showUserMenu&&(
                  <div className="fi" style={{position:"absolute",top:"calc(100% + 10px)",right:0,background:"var(--bg2)",border:"1px solid #2a2a3a",borderRadius:10,padding:"12px",minWidth:200,zIndex:50,boxShadow:"0 8px 32px rgba(0,0,0,.5)"}}>
                    <div style={{padding:"4px 8px 12px",borderBottom:"1px solid var(--border)",marginBottom:8}}>
                      <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:10,color:"#b0b4cc"}}>{profile?.name}</div>
                      <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:9,color:"var(--muted2)",marginTop:3}}>{session.user.email}</div>
                    </div>
                    {[{icon:"⚙",label:"Settings",action:()=>{setView("settings");setShowUserMenu(false);}},{icon:"◉",label:"Insights",action:()=>{setView("insights");setShowUserMenu(false);}}].map(item=>(
                      <button key={item.label} onClick={item.action} style={{width:"100%",background:"none",border:"none",cursor:"pointer",padding:"8px",borderRadius:6,display:"flex",alignItems:"center",gap:10,fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:10,color:"var(--muted)",transition:"all .2s",textAlign:"left"}}
                        onMouseEnter={e=>{e.currentTarget.style.background="var(--border)";e.currentTarget.style.color="#8890b0";}}
                        onMouseLeave={e=>{e.currentTarget.style.background="none";e.currentTarget.style.color="var(--muted)";}}>
                        <span>{item.icon}</span>{item.label}
                      </button>
                    ))}
                    <div style={{borderTop:"1px solid var(--border)",marginTop:4,paddingTop:4}}>
                      <button onClick={onLogout} style={{width:"100%",background:"none",border:"none",cursor:"pointer",padding:"8px",borderRadius:6,display:"flex",alignItems:"center",gap:10,fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:10,color:"var(--red)",transition:"background .2s",textAlign:"left"}}
                        onMouseEnter={e=>e.currentTarget.style.background="rgba(239,68,68,.06)"}
                        onMouseLeave={e=>e.currentTarget.style.background="none"}>
                        <span>→</span>Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{padding:"24px 28px",flex:1,overflowY:"auto"}}>

            {/* ── DASHBOARD ─────────────────────────────────────────── */}
            {view==="dashboard"&&(
              <div className="fi">
                {reviews.length===0&&!revLoading&&(
                  <div style={{background:"linear-gradient(135deg,#c8a96e0a,#7c8cf80a)",border:"1px solid #c8a96e20",borderRadius:12,padding:"28px 32px",marginBottom:24,display:"flex",alignItems:"center",gap:24}}>
                    <div style={{fontSize:36,flexShrink:0}}>✦</div>
                    <div>
                      <div style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:300,color:"var(--orange)",marginBottom:6}}>Welcome to Review Copilot</div>
                      <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:9,color:"var(--muted)",lineHeight:1.8}}>
                        Your dashboard is empty. Connect your Google Business Profile in{" "}
                        <button onClick={()=>setView("settings")} style={{background:"none",border:"none",cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:9,color:"var(--orange)",textDecoration:"underline"}}>Settings</button>
                        {" "}to import live reviews, or{" "}
                        <button onClick={()=>setView("reviews")} style={{background:"none",border:"none",cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:9,color:"var(--orange)",textDecoration:"underline"}}>add a test review</button>
                        {" "}to explore the features.
                      </div>
                    </div>
                  </div>
                )}
                {revLoading&&<div style={{textAlign:"center",padding:"60px 0",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:9,color:"var(--muted2)"}}>Loading reviews…</div>}
                {!revLoading&&(
                  <>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:24}}>
                      {[
                        {l:"Avg Rating",  v:stats.avg,      s:gPeriod.days===9999?"all time":gPeriod.label.toLowerCase(),a:"var(--orange)"},
                        {l:"Total Reviews",v:stats.total,   s:gPeriod.days===9999?"all time":gPeriod.label.toLowerCase(),a:"#818cf8"},
                        {l:"Positive",    v:stats.positive, s:stats.total?`${Math.round(stats.positive/stats.total*100)}% of total`:"no data",a:"var(--teal)"},
                        {l:"Need Reply",  v:stats.unreplied,s:"awaiting response",a:"var(--red)"},
                      ].map(s=>(
                        <div key={s.l} style={{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:10,padding:"18px 20px"}}>
                          <Label>{s.l}</Label>
                          <div style={{fontFamily:"'Syne',sans-serif",fontSize:38,fontWeight:300,color:s.a,lineHeight:1}}>{s.v}</div>
                          <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:9,color:"var(--muted)",marginTop:5}}>{s.s}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:22}}>
                      <Card style={{marginBottom:0}}>
                        <div style={{fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:300,marginBottom:16}}>Rating Distribution</div>
                        {periodReviews.length===0?<div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,color:"var(--muted2)",fontStyle:"italic",textAlign:"center",padding:"20px 0"}}>No reviews in this period</div>
                       :[5,4,3,2,1].map(star=>{ const cnt=periodReviews.filter(r=>r.rating===star).length, pct=Math.round(cnt/periodReviews.length*100); return(
                          <div key={star} style={{display:"flex",alignItems:"center",gap:10,marginBottom:9}}>
                            <Stars rating={star} size={11}/><div style={{flex:1,height:6,background:"var(--border)",borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,background:star>=4?"var(--teal)":star===3?"#fbbf24":"var(--red)",borderRadius:3}}/></div>
                            <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:8,color:"var(--muted)",width:24,textAlign:"right"}}>{cnt}</span>
                          </div>
                        );})}
                      </Card>
                      <Card style={{marginBottom:0}}>
                        <div style={{fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:300,marginBottom:16}}>Sentiment Breakdown</div>
                        {periodReviews.length===0?<div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,color:"var(--muted2)",fontStyle:"italic",textAlign:"center",padding:"20px 0"}}>No reviews in this period</div>
                        :[{l:"Positive",c:"var(--teal)",v:stats.positive},{l:"Neutral",c:"#fbbf24",v:periodReviews.filter(r=>r.sentiment==="neutral").length},{l:"Negative",c:"var(--red)",v:stats.negative}].map(s=>(
                          <div key={s.l} style={{marginBottom:14}}>
                            <div style={{display:"flex",justifyContent:"space-between",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:9,marginBottom:5}}>
                              <span style={{color:s.c}}>{s.l}</span><span style={{color:"var(--muted)"}}>{s.v} / {stats.total}</span>
                            </div>
                            <div style={{height:5,background:"var(--border)",borderRadius:3,overflow:"hidden"}}>
                              <div style={{height:"100%",width:stats.total?`${Math.round(s.v/stats.total*100)}%`:"0%",background:s.c,borderRadius:3,transition:"width .4s ease"}}/>
                            </div>
                          </div>
                        ))}
                      </Card>
                    </div>
                    <Card>
                      <div style={{fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:300,marginBottom:16}}>Recent Reviews</div>
                      {periodReviews.length===0?<div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,color:"var(--muted2)",fontStyle:"italic",textAlign:"center",padding:"10px 0"}}>No reviews in this period</div>
                      :periodReviews.slice(0,5).map(r=>(
                        <div key={r.id} style={{display:"flex",alignItems:"flex-start",gap:12,padding:"12px 0",borderBottom:"1px solid var(--border)",cursor:"pointer"}} onClick={()=>{setView("reviews");setSelected(r);}}>
                          <div style={{width:32,height:32,borderRadius:"50%",background:SB[r.sentiment],display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:9,color:SC[r.sentiment],flexShrink:0}}>{r.avatar}</div>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                              <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:10,color:"#b0b4cc"}}>{r.author}</span>
                              <div style={{display:"flex",alignItems:"center",gap:8}}><Stars rating={r.rating} size={10}/><span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:8,color:"var(--muted2)"}}>{new Date(r.created_at).toLocaleDateString()}</span></div>
                            </div>
                            <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12,color:"var(--muted)",lineHeight:1.5,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{r.text}</div>
                          </div>
                          {!r.replied&&<div style={{width:6,height:6,borderRadius:"50%",background:"var(--red)",marginTop:4,flexShrink:0}}/>}
                        </div>
                      ))}
                    </Card>
                  </>
                )}
              </div>
            )}

            {/* ── REVIEWS ───────────────────────────────────────────── */}
            {view==="reviews"&&(
              <div className="fi" style={{display:"grid",gridTemplateColumns:"320px 1fr",gap:18,height:"calc(100vh - 110px)"}}>
                <div style={{display:"flex",flexDirection:"column",gap:0,overflow:"hidden",background:"var(--bg)",border:"1px solid var(--border)",borderRadius:10}}>
                  <div style={{padding:"12px 14px",borderBottom:"1px solid var(--border)",display:"flex",gap:5,flexWrap:"wrap"}}>
                    {[{id:"all",l:"All"},{id:"unreplied",l:"Unreplied"},{id:"replied",l:"Replied"},{id:"flagged",l:"Flagged"}].map(t=>(
                      <button key={t.id} className={`tab${activeTab===t.id?" on":""}`} style={{flex:1}} onClick={()=>setActiveTab(t.id)}>{t.l}</button>
                    ))}
                  </div>
                  <div style={{flex:1,overflow:"auto",display:"flex",flexDirection:"column",gap:7,padding:"10px 8px"}}>
                    {revLoading?<div style={{textAlign:"center",padding:"40px 0",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:9,color:"var(--muted2)"}}>Loading…</div>
                    :filtered.length===0?(
                      <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flex:1,gap:10,padding:"40px 16px"}}>
                        <div style={{fontFamily:"'Syne',sans-serif",fontSize:32,color:"var(--border)"}}>◈</div>
                        <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,color:"var(--muted2)",fontStyle:"italic",textAlign:"center"}}>
                          {reviews.length===0?"No reviews yet":"No reviews match this filter"}
                        </div>
                        {reviews.length===0&&(
                          <button className="btn ghost" style={{fontSize:9,marginTop:4}} onClick={addTestReview}>+ Add test review</button>
                        )}
                      </div>
                    ):filtered.map(r=>(
                      <div key={r.id} className={`rc${selected?.id===r.id?" sel":""}`} onClick={()=>{setSelected(r);setGenReply("");setEditReply("");}}>
                        <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:8}}>
                          <div style={{width:30,height:30,borderRadius:"50%",background:SB[r.sentiment],display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:9,color:SC[r.sentiment],flexShrink:0}}>{r.avatar}</div>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                              <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:10,color:"#b0b4cc"}}>{r.author}</span>
                              <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:8,color:"var(--muted2)"}}>{new Date(r.created_at).toLocaleDateString()}</span>
                            </div>
                            <div style={{display:"flex",alignItems:"center",gap:5,marginTop:3}}>
                              <Stars rating={r.rating} size={10}/>
                              {r.flagged&&<span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:7,color:"var(--red)",background:"rgba(239,68,68,.09)",padding:"1px 5px",borderRadius:3}}>FLAGGED</span>}
                              {r.replied&&<span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:7,color:"var(--teal)",background:"rgba(52,211,153,.09)",padding:"1px 5px",borderRadius:3}}>REPLIED</span>}
                            </div>
                          </div>
                        </div>
                        <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12,color:"var(--muted)",lineHeight:1.5,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{r.text}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{overflow:"auto"}}>
                  {!selected?(
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:10}}>
                      <div style={{fontFamily:"'Syne',sans-serif",fontSize:44,color:"var(--border)"}}>✦</div>
                      <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:15,color:"var(--muted2)",fontStyle:"italic"}}>Select a review to respond</div>
                    </div>
                  ):(
                    <div className="fi">
                      <Card>
                        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:16,marginBottom:14}}>
                          <div style={{display:"flex",alignItems:"center",gap:12}}>
                            <div style={{width:42,height:42,borderRadius:"50%",background:SB[selected.sentiment],display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12,color:SC[selected.sentiment],border:`1px solid ${SC[selected.sentiment]}30`}}>{selected.avatar}</div>
                            <div>
                              <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12,color:"#d0d4f0"}}>{selected.author}</div>
                              <div style={{display:"flex",alignItems:"center",gap:8,marginTop:3}}><Stars rating={selected.rating} size={12}/><span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:8,color:"var(--muted2)"}}>{new Date(selected.created_at).toLocaleDateString()}</span></div>
                            </div>
                          </div>
                          <button className="btn ghost" style={{fontSize:9,padding:"6px 12px",color:selected.flagged?"var(--red)":"var(--muted)",borderColor:selected.flagged?"rgba(239,68,68,.2)":"var(--border2)"}} onClick={()=>toggleFlag(selected.id)}>{selected.flagged?"⚑ Unflag":"⚑ Flag"}</button>
                        </div>
                        <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:15,color:"#8890b0",lineHeight:1.7,padding:"14px 0",borderTop:"1px solid var(--border)",borderBottom:selected.replied?"1px solid #1e1e2e":"none"}}>"{selected.text}"</div>
                        {selected.replied&&selected.reply&&(
                          <div style={{marginTop:14,padding:"12px 15px",background:"rgba(52,211,153,.06)",borderLeft:"3px solid #10b981",borderRadius:"0 6px 6px 0"}}>
                            <Label color="var(--teal)">Your Reply</Label>
                            <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,color:"var(--muted)",lineHeight:1.6}}>{selected.reply}</div>
                          </div>
                        )}
                      </Card>
                      {!selected.replied&&(
                        <Card>
                          <div style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:300,marginBottom:16}}>Generate AI Reply</div>
                          <div style={{display:"flex",gap:10,marginBottom:16}}>
                            <div style={{flex:1}}><Label>Tone</Label>
                              <select value={tone} onChange={e=>setTone(e.target.value)}>
                                <option value="professional">Professional</option>
                                <option value="warm and friendly">Warm &amp; Friendly</option>
                                <option value="apologetic and empathetic">Apologetic</option>
                                <option value="concise and direct">Concise</option>
                                <option value="formal">Formal</option>
                              </select>
                            </div>
                            <div style={{display:"flex",alignItems:"flex-end"}}>
                              <button className="btn gold" onClick={()=>generateReply(selected)} disabled={isGen} style={{opacity:isGen?.7:1,whiteSpace:"nowrap"}}>
                                {isGen?`Generating${dots}`:"✦ Generate"}
                              </button>
                            </div>
                          </div>
                          {isGen&&<div className="pulse" style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,color:"var(--muted)",fontStyle:"italic",padding:"14px 0"}}>Crafting the perfect response…</div>}
                          {genReply&&!isGen&&(
                            <div className="fi">
                              <Label>Edit &amp; Send</Label>
                              <textarea rows={5} value={editReply} onChange={e=>setEditReply(e.target.value)}/>
                              <div style={{display:"flex",gap:10,marginTop:12}}>
                                <button className="btn gold" onClick={sendReply} style={{flex:1}}>✓ Post Reply</button>
                                <button className="btn ghost" onClick={()=>generateReply(selected)}>↺ Regenerate</button>
                              </div>
                            </div>
                          )}
                        </Card>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── INSIGHTS ──────────────────────────────────────────── */}
            {view==="insights"&&(
              <div className="fi" style={{maxWidth:740}}>
                <Card>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:300,marginBottom:16}}>Generate Business Insights</div>
                  <div style={{display:"flex",gap:12,alignItems:"flex-end",flexWrap:"wrap"}}>
                    <div style={{flex:1,minWidth:160,position:"relative"}}>
                      <Label>Analysis Period</Label>
                      <button className="period-btn" onClick={()=>setShowDatePicker(s=>!s)} style={{width:"100%",justifyContent:"space-between"}}>
                        <span>{iPeriod.label}</span><span style={{fontSize:8}}>▾</span>
                      </button>
                      {showDatePicker&&(
                        <div className="period-dropdown" style={{zIndex:200}}>
                          {TIME_PERIODS.map(p=>(
                            <button key={p.label} className={`period-opt${iPeriod.label===p.label?" sel-opt":""}`}
                              onClick={()=>{ if(p.days!==null){ setIPeriod(p);setIFrom("");setITo("");setShowDatePicker(false); } else setIPeriod(p); }}>
                              {p.label}
                            </button>
                          ))}
                          {iPeriod.days===null&&(
                            <div className="custom-date-row">
                              <input type="date" style={{flex:1,fontSize:9}} value={iFrom} onChange={e=>setIFrom(e.target.value)}/>
                              <input type="date" style={{flex:1,fontSize:9}} value={iTo} onChange={e=>setITo(e.target.value)}/>
                              <button className="btn gold" style={{fontSize:8,padding:"5px 10px"}} onClick={()=>setShowDatePicker(false)}>Apply</button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <button className="btn gold" onClick={generateInsights} disabled={iLoading||reviews.length===0}>
                      {iLoading?<><span className="sp" style={{marginRight:6,fontSize:9}}>◌</span>Analysing…</>:"✦ Generate Insights"}
                    </button>
                  </div>
                </Card>
                {iLoading&&<div style={{textAlign:"center",padding:"60px 0",fontFamily:"'Syne',sans-serif",fontSize:20,color:"var(--muted2)",fontStyle:"italic"}}>Analysing your reviews…</div>}
                {iData&&!iData.empty&&!iData.error&&!iLoading&&(
                  <div className="fi">
                    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:18}}>
                      {[{l:"Reviews Analysed",v:iData.count,c:"#818cf8"},{l:"Avg Rating",v:iData.avgRating+"★",c:"var(--orange)"},{l:"Urgency",v:(iData.urgency||"").toUpperCase(),c:iData.urgency==="high"?"var(--red)":iData.urgency==="medium"?"#fbbf24":"var(--teal)"}].map(s=>(
                        <div key={s.l} style={{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:8,padding:"14px 18px"}}>
                          <Label>{s.l}</Label>
                          <div style={{fontFamily:"'Syne',sans-serif",fontSize:24,fontWeight:300,color:s.c}}>{s.v}</div>
                        </div>
                      ))}
                    </div>
                    {iData.summary&&<Card><div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:15,color:"#8890b0",lineHeight:1.8,fontStyle:"italic"}}>"{iData.summary}"</div></Card>}
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14}}>
                      {[
                        {title:"Going Right",sub:"Strengths to maintain",icon:"✓",color:"var(--teal)",bg:"rgba(52,211,153,.04)",border:"rgba(52,211,153,.13)",arrow:"→",tc:"var(--muted)",items:iData.goingRight},
                        {title:"Going Wrong",sub:"Issues to address",icon:"✗",color:"var(--red)",bg:"rgba(239,68,68,.04)",border:"rgba(239,68,68,.13)",arrow:"→",tc:"var(--muted)",items:iData.goingWrong},
                        {title:"Improvements",sub:"Action items",icon:"↑",color:"var(--orange)",bg:"rgba(255,140,89,.04)",border:"rgba(255,140,89,.13)",arrow:"→",tc:"var(--muted)",items:iData.improvements},
                      ].map(col=>(
                        <Card key={col.title} style={{background:col.bg,border:`1px solid ${col.border}`,marginBottom:0}}>
                          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
                            <div style={{width:30,height:30,background:`${col.color}20`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:col.color}}>{col.icon}</div>
                            <div><div style={{fontFamily:"'Syne',sans-serif",fontSize:17,fontWeight:300,color:col.color}}>{col.title}</div><Label>{col.sub}</Label></div>
                          </div>
                          {col.items?.map((item,i)=>(<div key={i} className="ip" style={{background:col.bg,border:`1px solid ${col.border}`}}><span style={{color:col.color,fontSize:13,flexShrink:0,marginTop:1}}>{col.arrow}</span><span style={{color:col.tc,fontSize:13}}>{item}</span></div>))}
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
                {iData?.empty&&<div style={{textAlign:"center",padding:"60px 0",fontFamily:"'Syne',sans-serif",fontSize:20,color:"var(--muted2)",fontStyle:"italic"}}>No reviews found for this period.</div>}
                {iData?.error&&<div style={{textAlign:"center",padding:"60px 0",fontFamily:"'Syne',sans-serif",fontSize:20,color:"var(--red)",fontStyle:"italic"}}>Failed to generate insights. Please try again.</div>}
                {!iData&&!iLoading&&<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"70px 0",gap:10}}><div style={{fontFamily:"'Syne',sans-serif",fontSize:50,color:"var(--border)"}}>◉</div><div style={{fontFamily:"'Syne',sans-serif",fontSize:21,color:"var(--muted2)",fontStyle:"italic"}}>Select a time period and generate insights</div></div>}
              </div>
            )}

            {/* ── SETTINGS ──────────────────────────────────────────── */}
            {view==="settings"&&(
              <div className="fi" style={{maxWidth:660}}>
                <Card>
                  <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:20,paddingBottom:20,borderBottom:"1px solid var(--border)"}}>
                    <div style={{width:52,height:52,borderRadius:"50%",background:"linear-gradient(135deg,#c8a96e,#b8955a)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:16,color:"var(--bg)",fontWeight:600,flexShrink:0}}>{initials}</div>
                    <div>
                      <div style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:300}}>{profile?.name}</div>
                      <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:9,color:"var(--muted)",marginTop:3}}>{session.user.email}</div>
                      <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:8,color:"var(--muted2)",marginTop:4}}>Member since {new Date(profile?.created_at||Date.now()).toLocaleDateString("en-US",{month:"long",year:"numeric"})}</div>
                    </div>
                    <button className="btn ghost" style={{marginLeft:"auto",fontSize:9,color:"var(--red)",borderColor:"rgba(239,68,68,.2)"}} onClick={onLogout}>Sign Out</button>
                  </div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:300,marginBottom:16}}>Business Profile</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
                    <div><Label>Business Name</Label><input value={biz} onChange={e=>setBiz(e.target.value)}/></div>
                    <div><Label>Business Type</Label><input value={bizType} onChange={e=>setBizType(e.target.value)}/></div>
                  </div>
                  <div><Label>Default Reply Tone</Label>
                    <select value={tone} onChange={e=>setTone(e.target.value)}>
                      <option value="professional">Professional</option>
                      <option value="warm and friendly">Warm &amp; Friendly</option>
                      <option value="apologetic and empathetic">Apologetic</option>
                      <option value="concise and direct">Concise</option>
                      <option value="formal">Formal</option>
                    </select>
                  </div>
                  <div style={{marginTop:16}}><button className="btn gold" onClick={saveProfile}>Save Profile</button></div>
                </Card>

                <Card>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
                    <div><div style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:300}}>Email Notifications</div><div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:9,color:"var(--muted2)",marginTop:3}}>Get alerted when reviews match your criteria</div></div>
                    <label className="tog"><input type="checkbox" checked={nEnabled} onChange={e=>setNEnabled(e.target.checked)}/><span className="sli"/></label>
                  </div>
                  <div style={{opacity:nEnabled?1:.4,transition:"opacity .3s",pointerEvents:nEnabled?"auto":"none"}}>
                    <div style={{marginBottom:14}}><Label>Notification Email</Label><input type="email" value={nEmail} onChange={e=>setNEmail(e.target.value)}/></div>
                    <Label>Notify me when a review is…</Label>
                    <div style={{display:"flex",flexDirection:"column",gap:9,marginTop:8}}>
                      {[{l:"Negative (1–2 stars)",sub:"Recommended — catch issues fast",v:nNeg,set:setNNeg,a:"var(--red)"},{l:"Neutral (3 stars)",sub:"Track mixed experiences",v:nNeu,set:setNNeu,a:"#fbbf24"},{l:"Any new review",sub:"Get notified for all reviews",v:nAll,set:setNAll,a:"#818cf8"}].map(o=>(
                        <div key={o.l} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"11px 14px",background:"var(--bg)",border:`1px solid ${o.v?o.a+"30":"var(--border)"}`,borderRadius:8,transition:"border-color .2s"}}>
                          <div><div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:10,color:o.v?o.a:"var(--muted)"}}>{o.l}</div><div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:8,color:"var(--muted2)",marginTop:2}}>{o.sub}</div></div>
                          <label className="tog"><input type="checkbox" checked={o.v} onChange={e=>o.set(e.target.checked)}/><span className="sli"/></label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{marginTop:18}}><button className="btn gold" onClick={()=>{setNSaved(true);showToast("✓ Notification settings saved");setTimeout(()=>setNSaved(false),2500);}}>{nSaved?"✓ Saved":"Save Notification Settings"}</button></div>
                </Card>

                <Card>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
                    <div><div style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:300}}>Auto-Reply Copilot</div><div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:9,color:"var(--muted2)",marginTop:3}}>Automatically generate &amp; post AI replies</div></div>
                    <label className="tog"><input type="checkbox" checked={arEnabled} onChange={e=>setArEnabled(e.target.checked)}/><span className="sli"/></label>
                  </div>
                  <div style={{opacity:arEnabled?1:.4,transition:"opacity .3s",pointerEvents:arEnabled?"auto":"none"}}>
                    <Label>Auto-reply to reviews that are…</Label>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:16,marginTop:8}}>
                      {[{l:"Positive",sub:"4–5 stars",v:arPos,set:setArPos,c:"var(--teal)",ic:"✓"},{l:"Neutral",sub:"3 stars",v:arNeu,set:setArNeu,c:"#fbbf24",ic:"~"},{l:"Negative",sub:"1–2 stars",v:arNeg,set:setArNeg,c:"var(--red)",ic:"!"}].map(o=>(
                        <div key={o.l} onClick={()=>o.set(!o.v)} style={{cursor:"pointer",padding:"14px",background:o.v?`${o.c}10`:"var(--bg)",border:`1px solid ${o.v?o.c+"38":"var(--border)"}`,borderRadius:9,transition:"all .2s",textAlign:"center"}}>
                          <div style={{width:30,height:30,borderRadius:"50%",background:o.v?`${o.c}18`:"var(--border)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 8px",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,color:o.v?o.c:"var(--muted2)",transition:"all .2s"}}>{o.ic}</div>
                          <div style={{fontFamily:"'Syne',sans-serif",fontSize:15,color:o.v?o.c:"var(--muted)"}}>{o.l}</div>
                          <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:8,color:"var(--muted2)",marginTop:2}}>{o.sub}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{marginBottom:16}}><Label>Auto-Reply Tone</Label>
                      <select value={arTone} onChange={e=>setArTone(e.target.value)}>
                        <option value="professional">Professional</option><option value="warm and friendly">Warm &amp; Friendly</option>
                        <option value="apologetic and empathetic">Apologetic</option><option value="concise and direct">Concise</option><option value="formal">Formal</option>
                      </select>
                    </div>
                    <div style={{padding:"14px",background:"var(--bg)",border:"1px solid var(--border)",borderRadius:8}}>
                      <Label>Simulate Auto-Reply</Label>
                      <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:9,color:"var(--muted)",marginBottom:10,lineHeight:1.6}}>Test auto-reply on up to 3 unreplied reviews matching your selected types.</div>
                      <button className="btn grn" onClick={runAutoReply} disabled={arRunning||reviews.length===0}>{arRunning?<><span className="sp" style={{marginRight:5,fontSize:9}}>◌</span>Running…</>:"▶ Run Simulation"}</button>
                      {arLog.length>0&&(<div className="fi" style={{marginTop:12,display:"flex",flexDirection:"column",gap:5}}>{arLog.map((log,i)=>(<div key={i} style={{padding:"9px 11px",background:log.type==="success"?"rgba(52,211,153,.06)":log.type==="error"?"rgba(239,68,68,.06)":"var(--border)",borderRadius:6,borderLeft:`3px solid ${log.type==="success"?"var(--teal)":log.type==="error"?"var(--red)":"var(--muted2)"}`}}><div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:9,color:log.type==="success"?"var(--teal)":log.type==="error"?"var(--red)":"var(--muted)"}}>{log.msg}</div>{log.preview&&<div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:11,color:"var(--muted)",marginTop:5,lineHeight:1.5,fontStyle:"italic"}}>"{log.preview.slice(0,130)}{log.preview.length>130?"…":""}"</div>}</div>))}</div>)}
                    </div>
                  </div>
                  <div style={{marginTop:18}}><button className="btn gold" onClick={()=>{setArSaved(true);showToast("✓ Auto-reply settings saved");setTimeout(()=>setArSaved(false),2500);}}>{arSaved?"✓ Saved":"Save Auto-Reply Settings"}</button></div>
                </Card>

                <Card style={{border:profile?.google_connected?"1px solid #10b98130":"1px solid #c8a96e20",background:profile?.google_connected?"#10b98106":"rgba(255,140,89,.02)"}}>
                  <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:16}}>
                    <div style={{display:"flex",alignItems:"center",gap:14}}>
                      <div style={{width:44,height:44,borderRadius:12,background:profile?.google_connected?"rgba(52,211,153,.09)":"linear-gradient(135deg,#4285f420,#34a85320)",border:`1px solid ${profile?.google_connected?"rgba(52,211,153,.2)":"#4285f430"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>G</div>
                      <div>
                        <div style={{fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:300,color:profile?.google_connected?"var(--teal)":"var(--orange)"}}>Google Business Profile</div>
                        {profile?.google_connected?(
                          <div style={{display:"flex",alignItems:"center",gap:6,marginTop:4}}>
                            <div style={{width:6,height:6,borderRadius:"50%",background:"var(--teal)"}}/>
                            <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:9,color:"var(--teal)"}}>Connected</span>
                            <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:9,color:"var(--muted2)",margin:"0 4px"}}>·</span>
                            <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:9,color:"var(--muted)"}}>{profile.google_account}</span>
                          </div>
                        ):(
                          <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:9,color:"var(--muted)",marginTop:3}}>Not connected · demo mode</div>
                        )}
                      </div>
                    </div>
                    {profile?.google_connected?(
                      <div style={{display:"flex",gap:8,flexShrink:0}}>
                        <button className="btn ghost" style={{fontSize:9,padding:"7px 13px",color:"#818cf8",borderColor:"#7c8cf830"}} onClick={()=>setShowReconnectScreen(true)}>Reconnect</button>
                        <button className="btn ghost" style={{fontSize:9,padding:"7px 13px",color:"var(--red)",borderColor:"rgba(239,68,68,.2)"}} onClick={()=>setShowDisconnectModal(true)}>Disconnect</button>
                      </div>
                    ):(
                      <button className="btn gold" style={{fontSize:9,padding:"8px 16px",flexShrink:0}} onClick={()=>setShowReconnectScreen(true)}>Connect Account →</button>
                    )}
                  </div>
                </Card>

                <div style={{background:"rgba(239,68,68,.04)",border:"1px solid #ef444420",borderRadius:10,padding:"22px 26px",marginTop:6}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}><span style={{fontSize:14}}>⚠</span><div style={{fontFamily:"'Syne',sans-serif",fontSize:18,color:"var(--red)",fontWeight:300}}>Danger Zone</div></div>
                  <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:9,color:"var(--muted)",lineHeight:1.8,marginBottom:16}}>Permanently delete your account and all associated data. This cannot be undone.</div>
                  <button className="btn red-btn" style={{fontSize:9,padding:"8px 18px"}} onClick={()=>setShowDeleteModal(true)}>Delete Account</button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT — Auth state machine driven by Supabase onAuthStateChange
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [appState, setAppState]   = useState("loading"); // loading | auth | google-connect | app
  const [authView, setAuthView]   = useState("login");
  const [session, setSession]     = useState(null);
  const [profile, setProfile]     = useState(null);
  const [isNewUser, setIsNewUser] = useState(false);

  // Load profile from Supabase profiles table
  const loadProfile = useCallback(async (userId) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    return data;
  }, []);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      if(s) {
        const p = await loadProfile(s.user.id);
        setSession(s);
        setProfile(p);
        setAppState(p?.google_connected ? "app" : "google-connect");
      } else {
        setAppState("auth");
      }
    });

    // Listen for auth changes (login, signup, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, s) => {
      if(event === "SIGNED_OUT" || !s) {
        setSession(null); setProfile(null);
        setAppState("auth"); setAuthView("login");
        return;
      }
      if(event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        const p = await loadProfile(s.user.id);
        setSession(s); setProfile(p);
        if(event === "SIGNED_IN") {
          // New user: profile won't exist yet OR was just created by DB trigger
          setIsNewUser(!p || !p.google_connected);
          setAppState(!p?.google_connected ? "google-connect" : "app");
        } else {
          setAppState(p?.google_connected ? "app" : "google-connect");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [loadProfile]);

  const handleGoogleConnected = async () => {
    if(session) {
      const p = await loadProfile(session.user.id);
      setProfile(p);
    }
    setIsNewUser(false);
    setAppState("app");
  };

  const handleSkip = () => { setIsNewUser(false); setAppState("app"); };
  const handleLogout = () => supabase.auth.signOut();

  if(appState === "loading") {
    return (
      <div className="loading-screen" style={{fontFamily:"'Plus Jakarta Sans',sans-serif",position:"relative",overflow:"hidden"}}>
        <style>{GLOBAL_CSS}</style>
        <div style={{position:"absolute",top:"-20%",right:"-10%",width:"50vw",height:"50vw",borderRadius:"50%",background:"radial-gradient(circle,rgba(255,140,89,.07) 0%,transparent 70%)",filter:"blur(40px)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:"-20%",left:"-10%",width:"40vw",height:"40vw",borderRadius:"50%",background:"radial-gradient(circle,rgba(124,166,58,.06) 0%,transparent 70%)",filter:"blur(40px)",pointerEvents:"none"}}/>
        <div style={{textAlign:"center",position:"relative",zIndex:1}}>
          <div className="grad-text" style={{fontFamily:"'Syne',sans-serif",fontSize:36,fontWeight:700,letterSpacing:2,marginBottom:8}}>Review Copilot</div>
          <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:11,color:"var(--muted)",letterSpacing:2,textTransform:"uppercase",marginBottom:28}}>AI-Powered · Google Reviews</div>
          <div style={{display:"flex",gap:8,justifyContent:"center"}}>
            {[0,1,2].map(i=><div key={i} className="loading-dot" style={{animationDelay:`${i*0.2}s`}}/>)}
          </div>
        </div>
      </div>
    );
  }

  if(appState === "google-connect" && session) {
    return <GoogleConnectScreen
      profile={{...profile, name: profile?.name || session.user.user_metadata?.name, email: session.user.email, id: session.user.id}}
      onConnected={handleGoogleConnected}
      onSkip={handleSkip}
    />;
  }

  if(appState === "app" && session && profile) {
    return <MainApp session={session} profile={profile} onLogout={handleLogout}/>;
  }

  // Auth screens
  return (
    <div>
      {authView === "signup" && <SignupScreen onGoLogin={()=>setAuthView("login")}/>}
      {authView === "forgot" && <ForgotScreen onGoLogin={()=>setAuthView("login")}/>}
      {authView === "login"  && <LoginScreen onGoSignup={()=>setAuthView("signup")} onGoForgot={()=>setAuthView("forgot")}/>}
    </div>
  );
}
