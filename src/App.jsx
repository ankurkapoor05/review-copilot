import { useState, useEffect } from "react";

// ─── Shared Styles ────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=DM+Mono:wght@300;400&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:#0d0d14}
  ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#2a2a3a;border-radius:2px}
  .tab{background:none;border:none;cursor:pointer;padding:7px 14px;font-family:'DM Mono',monospace;font-size:10px;letter-spacing:1px;text-transform:uppercase;transition:all .2s;border-radius:4px;color:#555}
  .tab:hover{color:#888;background:#1a1a28} .tab.on{background:#1a1a28!important;color:#c8a96e!important}
  .rc{background:#13131f;border:1px solid #1e1e2e;border-radius:8px;padding:14px;cursor:pointer;transition:all .2s}
  .rc:hover{border-color:#2a2a3a;background:#16162a} .rc.sel{border-color:#c8a96e40!important;background:#16162a!important}
  .btn{border:none;cursor:pointer;font-family:'DM Mono',monospace;font-size:10px;letter-spacing:1px;text-transform:uppercase;padding:9px 18px;border-radius:5px;transition:all .2s}
  .gold{background:#c8a96e;color:#0d0d14;font-weight:500}.gold:hover{background:#d4b87a}
  .ghost{background:transparent;color:#888;border:1px solid #2a2a3a}.ghost:hover{border-color:#555;color:#aaa}
  .grn{background:#10b98118;color:#10b981;border:1px solid #10b98130}.grn:hover{background:#10b98128}
  .nav{background:none;border:none;cursor:pointer;padding:9px 14px;font-family:'DM Mono',monospace;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#555;transition:all .2s;width:100%;text-align:left;border-radius:6px;display:flex;align-items:center;gap:10px}
  .nav:hover{background:#13131f;color:#888} .nav.on{color:#c8a96e!important;background:#c8a96e10!important}
  textarea{background:#0d0d14;border:1px solid #2a2a3a;border-radius:6px;color:#e8e4da;font-family:Georgia,serif;font-size:14px;line-height:1.6;padding:13px;resize:none;width:100%;outline:none;transition:border-color .2s}
  textarea:focus{border-color:#c8a96e50}
  input,select{background:#13131f;border:1px solid #1e1e2e;border-radius:6px;color:#e8e4da;font-family:'DM Mono',monospace;font-size:11px;padding:9px 13px;outline:none;transition:border-color .2s;width:100%}
  input:focus,select:focus{border-color:#c8a96e50} input[type=checkbox]{width:auto;cursor:pointer} input[type=date]{color-scheme:dark}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}} .pulse{animation:pulse 1.5s infinite}
  @keyframes fi{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}} .fi{animation:fi .35s ease}
  @keyframes sp{to{transform:rotate(360deg)}} .sp{animation:sp 1s linear infinite;display:inline-block}
  @keyframes authIn{from{opacity:0;transform:translateY(20px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}} .auth-in{animation:authIn .45s cubic-bezier(.16,1,.3,1)}
  @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
  .tog{position:relative;display:inline-block;width:44px;height:24px;flex-shrink:0}
  .tog input{opacity:0;width:0;height:0}
  .sli{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background:#1e1e2e;border-radius:24px;transition:.3s;border:1px solid #2a2a3a}
  .sli:before{position:absolute;content:"";height:16px;width:16px;left:3px;bottom:3px;background:#555;border-radius:50%;transition:.3s}
  input:checked+.sli{background:#c8a96e20;border-color:#c8a96e50} input:checked+.sli:before{transform:translateX(20px);background:#c8a96e}
  .ip{display:flex;align-items:flex-start;gap:8px;padding:11px 13px;border-radius:8px;font-family:Georgia,serif;font-size:13px;line-height:1.5;margin-bottom:8px;width:100%}
  .period-btn{background:#13131f;border:1px solid #1e1e2e;border-radius:6px;padding:7px 13px;font-family:'DM Mono',monospace;font-size:10px;letter-spacing:1px;color:#888;cursor:pointer;display:flex;align-items:center;gap:8px;transition:all .2s;white-space:nowrap}
  .period-btn:hover{border-color:#2a2a3a;color:#c8a96e}
  .period-btn.active-period{border-color:#c8a96e40;color:#c8a96e;background:#c8a96e08}
  .period-dropdown{position:absolute;top:calc(100% + 8px);right:0;background:#13131f;border:1px solid #1e1e2e;border-radius:8px;overflow:hidden;z-index:100;min-width:200px;box-shadow:0 8px 32px rgba(0,0,0,.5)}
  .period-opt{display:block;width:100%;background:none;border:none;text-align:left;padding:10px 16px;font-family:'DM Mono',monospace;font-size:10px;letter-spacing:1px;color:#666;cursor:pointer;transition:all .15s}
  .period-opt:hover{background:#1a1a28;color:#c8a96e}
  .period-opt.sel-opt{color:#c8a96e;background:#c8a96e0a}
  .custom-date-row{display:flex;gap:8px;padding:10px 14px;border-top:1px solid #1e1e2e;background:#0d0d14}
  .auth-input{background:#0d0d14!important;border:1px solid #2a2a3a!important;border-radius:8px!important;color:#e8e4da!important;font-family:'DM Mono',monospace!important;font-size:12px!important;padding:13px 16px!important;outline:none!important;transition:border-color .2s,box-shadow .2s!important;width:100%!important}
  .auth-input:focus{border-color:#c8a96e60!important;box-shadow:0 0 0 3px #c8a96e0d!important}
  .auth-input.err{border-color:#ef444460!important}
  .auth-btn{width:100%;padding:14px;background:linear-gradient(135deg,#c8a96e,#b8955a);border:none;border-radius:8px;color:#0d0d14;font-family:'DM Mono',monospace;font-size:11px;font-weight:500;letter-spacing:1.5px;text-transform:uppercase;cursor:pointer;transition:all .2s;margin-top:4px}
  .auth-btn:hover{background:linear-gradient(135deg,#d4b87a,#c8a96e);transform:translateY(-1px);box-shadow:0 4px 20px #c8a96e30}
  .auth-btn:active{transform:translateY(0)}
  .auth-btn:disabled{opacity:.5;cursor:not-allowed;transform:none}
  .auth-link{background:none;border:none;cursor:pointer;font-family:'DM Mono',monospace;font-size:10px;color:#c8a96e;letter-spacing:.5px;text-decoration:underline;text-decoration-color:#c8a96e40;transition:color .2s}
  .auth-link:hover{color:#d4b87a}
  .pw-strength{height:3px;border-radius:2px;transition:all .3s;margin-top:6px}
  .field-err{font-family:'DM Mono',monospace;font-size:9px;color:#ef4444;margin-top:5px;letter-spacing:.5px}
  .success-toast{position:fixed;top:24px;right:24px;background:#10b981;color:#0d0d14;font-family:'DM Mono',monospace;font-size:10px;letter-spacing:1px;padding:10px 18px;border-radius:6px;z-index:9999;animation:fi .3s ease}
  .error-toast{position:fixed;top:24px;right:24px;background:#ef4444;color:#fff;font-family:'DM Mono',monospace;font-size:10px;letter-spacing:1px;padding:10px 18px;border-radius:6px;z-index:9999;animation:fi .3s ease}
  @keyframes modalIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}} .modal-in{animation:modalIn .25s cubic-bezier(.16,1,.3,1)}
  @keyframes overlayIn{from{opacity:0}to{opacity:1}} .overlay-in{animation:overlayIn .2s ease}
  .goog-btn{display:flex;align-items:center;gap:12px;width:100%;padding:14px 18px;background:#fff;border:1.5px solid #dadce0;border-radius:10px;cursor:pointer;font-family:'DM Mono',monospace;font-size:11px;color:#3c4043;letter-spacing:.3px;transition:all .2s;justify-content:center}
  .goog-btn:hover{background:#f8f9fa;box-shadow:0 2px 12px rgba(0,0,0,.15);border-color:#c6c9cc}
  .goog-btn:disabled{opacity:.5;cursor:not-allowed}
  .perm-row{display:flex;align-items:flex-start;gap:12px;padding:12px 0;border-bottom:1px solid #1e1e2e}
  .perm-row:last-child{border-bottom:none}
  .del-input{background:#0d0d14!important;border:1px solid #ef444440!important;border-radius:8px!important;color:#e8e4da!important;font-family:'DM Mono',monospace!important;font-size:12px!important;padding:12px 14px!important;outline:none!important;width:100%!important;transition:border-color .2s!important}
  .del-input:focus{border-color:#ef4444!important}
`;

// ─── Demo Data ────────────────────────────────────────────────────────────────
const generateDate = (daysAgo) => { const d = new Date(); d.setDate(d.getDate() - daysAgo); return d; };
const DEMO_REVIEWS = [
  { id:1,  author:"Sarah M.",  avatar:"SM", rating:5, date:generateDate(2),   text:"Absolutely incredible experience! The staff was so attentive and the quality exceeded all my expectations. I'll definitely be coming back and recommending this to all my friends.", replied:false, flagged:false, sentiment:"positive" },
  { id:2,  author:"James K.",  avatar:"JK", rating:2, date:generateDate(3),   text:"Very disappointed. Waited over 45 minutes and no one acknowledged us. When we finally got service, the order was wrong. The manager didn't seem to care when we complained.", replied:false, flagged:true,  sentiment:"negative" },
  { id:3,  author:"Priya L.",  avatar:"PL", rating:4, date:generateDate(5),   text:"Generally a great place. The atmosphere is lovely and the product range is impressive. Service was a bit slow but the quality makes up for it. Would come back.", replied:true,  flagged:false, sentiment:"positive", reply:"Thank you so much, Priya! We're glad you enjoyed the atmosphere." },
  { id:4,  author:"Tom B.",    avatar:"TB", rating:1, date:generateDate(8),   text:"Worst experience I've ever had. Completely unprofessional staff, terrible product quality, and they refused to give a refund. Will be filing a complaint.", replied:false, flagged:true,  sentiment:"negative" },
  { id:5,  author:"Nina W.",   avatar:"NW", rating:5, date:generateDate(10),  text:"Found this gem by accident and couldn't be happier! Everything was perfect from the moment we walked in to when we left. The attention to detail is unmatched.", replied:false, flagged:false, sentiment:"positive" },
  { id:6,  author:"Carlos R.", avatar:"CR", rating:3, date:generateDate(14),  text:"Decent experience overall. Nothing particularly stood out but nothing was terrible either. Average pricing for the area. Might return if in the neighborhood.", replied:false, flagged:false, sentiment:"neutral" },
  { id:7,  author:"Elena V.",  avatar:"EV", rating:5, date:generateDate(18),  text:"The team here genuinely cares about their customers. I had a small issue and they resolved it immediately with no fuss. Will 100% return and bring my whole family.", replied:true,  flagged:false, sentiment:"positive", reply:"Thank you Elena, that means the world to us!" },
  { id:8,  author:"Marcus D.", avatar:"MD", rating:2, date:generateDate(22),  text:"Long wait times and disorganized staff. The product itself was fine but I left frustrated. Better staff training and a queue management system are desperately needed.", replied:false, flagged:false, sentiment:"negative" },
  { id:9,  author:"Yuki T.",   avatar:"YT", rating:4, date:generateDate(28),  text:"Good experience overall. The quality is consistently high and the location is convenient. Prices have gone up a bit recently which is a concern but still worth it.", replied:false, flagged:false, sentiment:"positive" },
  { id:10, author:"Aisha B.",  avatar:"AB", rating:1, date:generateDate(35),  text:"Completely unacceptable hygiene standards. Found a foreign object in my order. When I raised it the staff were dismissive and rude. Reported to health authorities.", replied:false, flagged:true,  sentiment:"negative" },
  { id:11, author:"Oliver P.", avatar:"OP", rating:5, date:generateDate(42),  text:"Been coming here for 3 years and the consistency is what keeps me loyal. Every single time is a great experience. The staff remember regulars which makes you feel valued.", replied:false, flagged:false, sentiment:"positive" },
  { id:12, author:"Rachel S.", avatar:"RS", rating:3, date:generateDate(55),  text:"Mixed feelings. Some days are great, others not so much. The inconsistency is the main issue. When it's good it's really good, but you can't always count on it.", replied:false, flagged:false, sentiment:"neutral" },
  { id:13, author:"David C.",  avatar:"DC", rating:4, date:generateDate(70),  text:"Really solid place. Staff are friendly and knowledgeable. Parking can be tough during peak hours but that's more of a location issue than anything else.", replied:false, flagged:false, sentiment:"positive" },
  { id:14, author:"Fatima H.", avatar:"FH", rating:5, date:generateDate(90),  text:"Exceptional quality and service every time. I've tried competitors and nothing comes close. This place sets the standard for the whole industry.", replied:false, flagged:false, sentiment:"positive" },
  { id:15, author:"Ben A.",    avatar:"BA", rating:2, date:generateDate(120), text:"Used to be my favorite but quality has clearly dropped over the past year. Staff turnover seems high and it shows. Hope management takes action before losing more loyal customers.", replied:false, flagged:false, sentiment:"negative" },
];

const TIME_PERIODS = [
  {label:"Last 1 Week",days:7},{label:"Last 2 Weeks",days:14},{label:"Last Month",days:30},
  {label:"Last 3 Months",days:90},{label:"Last 6 Months",days:180},{label:"Last 1 Year",days:365},
  {label:"Last 3 Years",days:1095},{label:"Custom Date",days:null},
];
function filterByPeriod(reviews,period,from,to){
  const now=new Date();
  return reviews.filter(r=>{
    const d=new Date(r.date);
    if(period.days!==null){const c=new Date(now);c.setDate(c.getDate()-period.days);return d>=c;}
    const f=from?new Date(from):new Date(0),t=to?new Date(to):now;
    return d>=f&&d<=t;
  });
}
const Stars=({rating,size=14})=>(
  <span style={{display:"inline-flex",gap:1}}>
    {[1,2,3,4,5].map(s=>(
      <svg key={s} width={size} height={size} viewBox="0 0 24 24" fill={s<=rating?"#F59E0B":"#2a2a3a"}>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ))}
  </span>
);
const SC={positive:"#10b981",neutral:"#f59e0b",negative:"#ef4444"};
const SB={positive:"#10b98115",neutral:"#f59e0b15",negative:"#ef444415"};
const Label=({children,color})=>(
  <div style={{fontFamily:"DM Mono,monospace",fontSize:9,color:color||"#444",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:7}}>{children}</div>
);
const Card=({children,style})=>(
  <div style={{background:"#13131f",border:"1px solid #1e1e2e",borderRadius:10,padding:"22px 26px",marginBottom:18,...style}}>{children}</div>
);

// ─── Auth Helpers ─────────────────────────────────────────────────────────────
const USERS_KEY = "rc_users";
const SESSION_KEY = "rc_session";
function getUsers(){ try{ return JSON.parse(localStorage.getItem(USERS_KEY)||"[]"); }catch{ return []; } }
function saveUsers(u){ localStorage.setItem(USERS_KEY,JSON.stringify(u)); }
function getSession(){ try{ return JSON.parse(localStorage.getItem(SESSION_KEY)||"null"); }catch{ return null; } }
function saveSession(u){ localStorage.setItem(SESSION_KEY,JSON.stringify(u)); }
function clearSession(){ localStorage.removeItem(SESSION_KEY); }
function pwStrength(p){
  if(!p) return 0;
  let s=0;
  if(p.length>=8) s++;
  if(/[A-Z]/.test(p)) s++;
  if(/[0-9]/.test(p)) s++;
  if(/[^A-Za-z0-9]/.test(p)) s++;
  return s;
}
const PW_COLORS=["#ef4444","#f59e0b","#f59e0b","#10b981","#10b981"];
const PW_LABELS=["","Weak","Fair","Good","Strong"];

// ═══════════════════════════════════════════════════════════════════════════════
// AUTH SCREENS
// ═══════════════════════════════════════════════════════════════════════════════

// Shared decorative background
const AuthBG = () => (
  <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
    <div style={{position:"absolute",top:"-20%",right:"-10%",width:"60vw",height:"60vw",borderRadius:"50%",background:"radial-gradient(circle,#c8a96e08 0%,transparent 70%)"}}/>
    <div style={{position:"absolute",bottom:"-15%",left:"-5%",width:"40vw",height:"40vw",borderRadius:"50%",background:"radial-gradient(circle,#7c8cf808 0%,transparent 70%)"}}/>
    {/* subtle grid lines */}
    <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:.03}} xmlns="http://www.w3.org/2000/svg">
      <defs><pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M 60 0 L 0 0 0 60" fill="none" stroke="#c8a96e" strokeWidth="1"/></pattern></defs>
      <rect width="100%" height="100%" fill="url(#grid)"/>
    </svg>
  </div>
);

const AuthLogo = () => (
  <div style={{textAlign:"center",marginBottom:32}}>
    <div style={{display:"inline-flex",flexDirection:"column",alignItems:"center",gap:2}}>
      <div style={{display:"flex",gap:6,alignItems:"baseline"}}>
        <span style={{fontFamily:"Cormorant Garamond,serif",fontSize:32,fontWeight:300,color:"#c8a96e",letterSpacing:2}}>Review</span>
        <span style={{fontFamily:"Cormorant Garamond,serif",fontSize:32,fontWeight:300,color:"#e8e4da",letterSpacing:2}}>Copilot</span>
      </div>
      <div style={{fontFamily:"DM Mono,monospace",fontSize:8,color:"#444",letterSpacing:3,textTransform:"uppercase"}}>AI-Powered · Google Reviews</div>
    </div>
  </div>
);

function LoginScreen({ onLogin, onGoSignup, onGoForgot }) {
  const [email, setEmail]     = useState("");
  const [pw, setPw]           = useState("");
  const [showPw, setShowPw]   = useState(false);
  const [err, setErr]         = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setErr("");
    if(!email.trim()) return setErr("Email is required.");
    if(!pw) return setErr("Password is required.");
    setLoading(true);
    await new Promise(r=>setTimeout(r,600));
    const users = getUsers();
    const user = users.find(u=>u.email.toLowerCase()===email.toLowerCase().trim());
    if(!user) { setErr("No account found with this email."); setLoading(false); return; }
    if(user.password !== pw) { setErr("Incorrect password. Please try again."); setLoading(false); return; }
    saveSession(user);
    onLogin(user);
  };

  return (
    <div style={{minHeight:"100vh",background:"#0d0d14",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",fontFamily:"Georgia,serif"}}>
      <style>{GLOBAL_CSS}</style>
      <AuthBG/>
      <div className="auth-in" style={{width:"100%",maxWidth:420,padding:"0 24px",position:"relative",zIndex:1}}>
        <AuthLogo/>
        <div style={{background:"#13131f",border:"1px solid #1e1e2e",borderRadius:16,padding:"36px 36px 32px"}}>
          <div style={{marginBottom:28}}>
            <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:24,fontWeight:300,color:"#e8e4da",marginBottom:6}}>Welcome back</div>
            <div style={{fontFamily:"DM Mono,monospace",fontSize:10,color:"#444",letterSpacing:.5}}>Sign in to your account to continue</div>
          </div>

          {err && (
            <div className="fi" style={{marginBottom:16,padding:"10px 14px",background:"#ef444410",border:"1px solid #ef444430",borderRadius:7,display:"flex",alignItems:"center",gap:8}}>
              <span style={{color:"#ef4444",fontSize:12}}>⚠</span>
              <span style={{fontFamily:"DM Mono,monospace",fontSize:10,color:"#ef4444"}}>{err}</span>
            </div>
          )}

          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div>
              <Label>Email Address</Label>
              <input className={`auth-input${err&&!email?" err":""}`} type="email" placeholder="you@business.com"
                value={email} onChange={e=>{setEmail(e.target.value);setErr("");}}
                onKeyDown={e=>e.key==="Enter"&&submit()}/>
            </div>
            <div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:7}}>
                <Label style={{marginBottom:0}}>Password</Label>
                <button className="auth-link" onClick={onGoForgot} style={{fontSize:9}}>Forgot password?</button>
              </div>
              <div style={{position:"relative"}}>
                <input className={`auth-input${err&&!pw?" err":""}`} type={showPw?"text":"password"} placeholder="Enter your password"
                  value={pw} onChange={e=>{setPw(e.target.value);setErr("");}}
                  onKeyDown={e=>e.key==="Enter"&&submit()} style={{paddingRight:42}}/>
                <button onClick={()=>setShowPw(s=>!s)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#555",fontSize:12,padding:2}}>
                  {showPw?"🙈":"👁"}
                </button>
              </div>
            </div>
          </div>

          <button className="auth-btn" onClick={submit} disabled={loading} style={{marginTop:22}}>
            {loading?<><span className="sp" style={{marginRight:7,fontSize:10}}>◌</span>Signing in…</>:"Sign In"}
          </button>

          <div style={{textAlign:"center",marginTop:22,fontFamily:"DM Mono,monospace",fontSize:10,color:"#444"}}>
            Don't have an account?{" "}
            <button className="auth-link" onClick={onGoSignup}>Create one</button>
          </div>
        </div>

        {/* Demo hint */}
        <div style={{marginTop:16,padding:"10px 16px",background:"#c8a96e08",border:"1px solid #c8a96e18",borderRadius:8,textAlign:"center"}}>
          <div style={{fontFamily:"DM Mono,monospace",fontSize:9,color:"#c8a96e60",letterSpacing:.5}}>
            ✦ New here? Sign up above, or{" "}
            <button className="auth-link" onClick={()=>{setEmail("demo@reviewcopilot.com");setPw("Demo@1234");}} style={{fontSize:9,color:"#c8a96e"}}>use demo credentials</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SignupScreen({ onSignup, onGoLogin }) {
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
    await new Promise(r=>setTimeout(r,700));
    const users = getUsers();
    if(users.find(u=>u.email.toLowerCase()===email.toLowerCase().trim())){
      setErrs({email:"An account with this email already exists."}); setLoading(false); return;
    }
    const newUser = { id:Date.now(), name:name.trim(), email:email.toLowerCase().trim(), password:pw, biz:biz.trim(), bizType:bizType.trim()||"Business", createdAt:new Date().toISOString() };
    saveUsers([...users, newUser]);
    saveSession(newUser);
    onSignup(newUser);
  };

  return (
    <div style={{minHeight:"100vh",background:"#0d0d14",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",fontFamily:"Georgia,serif",padding:"24px 0"}}>
      <style>{GLOBAL_CSS}</style>
      <AuthBG/>
      <div className="auth-in" style={{width:"100%",maxWidth:460,padding:"0 24px",position:"relative",zIndex:1}}>
        <AuthLogo/>
        <div style={{background:"#13131f",border:"1px solid #1e1e2e",borderRadius:16,padding:"36px 36px 32px"}}>
          <div style={{marginBottom:28}}>
            <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:24,fontWeight:300,color:"#e8e4da",marginBottom:6}}>Create your account</div>
            <div style={{fontFamily:"DM Mono,monospace",fontSize:10,color:"#444",letterSpacing:.5}}>Start managing your Google reviews with AI</div>
          </div>

          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            {/* Name + Email */}
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

            {/* Business */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div>
                <Label>Business Name</Label>
                <input className={`auth-input${errs.biz?" err":""}`} placeholder="Bella Vista Café" value={biz} onChange={e=>{setBiz(e.target.value);setErrs(p=>({...p,biz:""}));}}/>
                {errs.biz&&<div className="field-err">{errs.biz}</div>}
              </div>
              <div>
                <Label>Business Type <span style={{color:"#333"}}>(optional)</span></Label>
                <input className="auth-input" placeholder="Restaurant, Salon…" value={bizType} onChange={e=>setBizType(e.target.value)}/>
              </div>
            </div>

            {/* Password */}
            <div>
              <Label>Password</Label>
              <div style={{position:"relative"}}>
                <input className={`auth-input${errs.pw?" err":""}`} type={showPw?"text":"password"} placeholder="Min. 8 characters"
                  value={pw} onChange={e=>{setPw(e.target.value);setErrs(p=>({...p,pw:""}));}} style={{paddingRight:42}}/>
                <button onClick={()=>setShowPw(s=>!s)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#555",fontSize:12,padding:2}}>
                  {showPw?"🙈":"👁"}
                </button>
              </div>
              {pw&&(
                <div style={{marginTop:7}}>
                  <div style={{display:"flex",gap:3}}>
                    {[1,2,3,4].map(i=>(
                      <div key={i} style={{flex:1,height:3,borderRadius:2,background:i<=strength?PW_COLORS[strength]:"#2a2a3a",transition:"background .3s"}}/>
                    ))}
                  </div>
                  {strength>0&&<div style={{fontFamily:"DM Mono,monospace",fontSize:8,color:PW_COLORS[strength],marginTop:4,letterSpacing:.5}}>{PW_LABELS[strength]}</div>}
                </div>
              )}
              {errs.pw&&<div className="field-err">{errs.pw}</div>}
            </div>

            {/* Confirm Password */}
            <div>
              <Label>Confirm Password</Label>
              <input className={`auth-input${errs.pw2?" err":""}`} type="password" placeholder="Repeat your password"
                value={pw2} onChange={e=>{setPw2(e.target.value);setErrs(p=>({...p,pw2:""}));}}/>
              {errs.pw2&&<div className="field-err">{errs.pw2}</div>}
            </div>

            {/* Terms */}
            <div style={{display:"flex",alignItems:"flex-start",gap:10,padding:"12px 14px",background:errs.agree?"#ef444408":"#0d0d14",border:`1px solid ${errs.agree?"#ef444430":"#1e1e2e"}`,borderRadius:8,transition:"all .2s",cursor:"pointer"}} onClick={()=>{setAgree(a=>!a);setErrs(p=>({...p,agree:""}));}}>
              <div style={{width:16,height:16,borderRadius:4,border:`1px solid ${agree?"#c8a96e":"#2a2a3a"}`,background:agree?"#c8a96e":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1,transition:"all .2s"}}>
                {agree&&<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#0d0d14" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
              </div>
              <div style={{fontFamily:"DM Mono,monospace",fontSize:9,color:"#666",lineHeight:1.7}}>
                I agree to the <span style={{color:"#c8a96e",textDecoration:"underline",cursor:"pointer"}}>Terms of Service</span> and <span style={{color:"#c8a96e",textDecoration:"underline",cursor:"pointer"}}>Privacy Policy</span>
              </div>
            </div>
            {errs.agree&&<div className="field-err" style={{marginTop:-8}}>{errs.agree}</div>}
          </div>

          <button className="auth-btn" onClick={submit} disabled={loading} style={{marginTop:22}}>
            {loading?<><span className="sp" style={{marginRight:7,fontSize:10}}>◌</span>Creating account…</>:"Create Account"}
          </button>

          <div style={{textAlign:"center",marginTop:22,fontFamily:"DM Mono,monospace",fontSize:10,color:"#444"}}>
            Already have an account?{" "}
            <button className="auth-link" onClick={onGoLogin}>Sign in</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ForgotScreen({ onGoLogin }) {
  const [email, setEmail]   = useState("");
  const [sent, setSent]     = useState(false);
  const [err, setErr]       = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if(!email.trim()) return setErr("Email is required.");
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setErr("Enter a valid email.");
    setLoading(true);
    await new Promise(r=>setTimeout(r,700));
    // In a real app: send reset email. Here we just simulate.
    setSent(true);
    setLoading(false);
  };

  return (
    <div style={{minHeight:"100vh",background:"#0d0d14",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",fontFamily:"Georgia,serif"}}>
      <style>{GLOBAL_CSS}</style>
      <AuthBG/>
      <div className="auth-in" style={{width:"100%",maxWidth:400,padding:"0 24px",position:"relative",zIndex:1}}>
        <AuthLogo/>
        <div style={{background:"#13131f",border:"1px solid #1e1e2e",borderRadius:16,padding:"36px 36px 32px"}}>
          {!sent ? (
            <>
              <div style={{marginBottom:28}}>
                <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:24,fontWeight:300,color:"#e8e4da",marginBottom:6}}>Reset password</div>
                <div style={{fontFamily:"DM Mono,monospace",fontSize:10,color:"#444",letterSpacing:.5}}>Enter your email and we'll send a reset link</div>
              </div>
              {err&&(
                <div className="fi" style={{marginBottom:16,padding:"10px 14px",background:"#ef444410",border:"1px solid #ef444430",borderRadius:7,display:"flex",alignItems:"center",gap:8}}>
                  <span style={{color:"#ef4444",fontSize:12}}>⚠</span>
                  <span style={{fontFamily:"DM Mono,monospace",fontSize:10,color:"#ef4444"}}>{err}</span>
                </div>
              )}
              <div>
                <Label>Email Address</Label>
                <input className={`auth-input${err?" err":""}`} type="email" placeholder="you@business.com"
                  value={email} onChange={e=>{setEmail(e.target.value);setErr("");}}
                  onKeyDown={e=>e.key==="Enter"&&submit()}/>
              </div>
              <button className="auth-btn" onClick={submit} disabled={loading} style={{marginTop:20}}>
                {loading?<><span className="sp" style={{marginRight:7,fontSize:10}}>◌</span>Sending…</>:"Send Reset Link"}
              </button>
            </>
          ) : (
            <div className="fi" style={{textAlign:"center",padding:"10px 0"}}>
              <div style={{fontSize:40,marginBottom:16}}>✉</div>
              <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:22,fontWeight:300,color:"#10b981",marginBottom:10}}>Check your inbox</div>
              <div style={{fontFamily:"DM Mono,monospace",fontSize:10,color:"#555",lineHeight:1.8}}>
                A password reset link has been sent to<br/>
                <span style={{color:"#c8a96e"}}>{email}</span><br/>
                It may take a minute to arrive.
              </div>
            </div>
          )}
          <div style={{textAlign:"center",marginTop:24,fontFamily:"DM Mono,monospace",fontSize:10,color:"#444"}}>
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
  { icon:"⭐", color:"#F59E0B", title:"Read your Google reviews",       desc:"Access all reviews posted on your Google Business Profile in real time." },
  { icon:"✏",  color:"#7c8cf8", title:"Post replies on your behalf",    desc:"Allow the copilot to publish AI-generated replies directly to Google." },
  { icon:"🏢", color:"#10b981", title:"View business profile info",     desc:"Read your business name, address, category and operating hours." },
  { icon:"📊", color:"#c8a96e", title:"Access review analytics",        desc:"Retrieve rating history and review trends to power insights." },
];

function GoogleConnectScreen({ user, onConnected, onSkip }) {
  const [step, setStep]       = useState("intro");   // intro | authorizing | success
  const [progress, setProgress] = useState(0);
  const [authWindow, setAuthWindow] = useState(null);

  const startAuth = () => {
    setStep("authorizing");
    setProgress(0);
    // Simulate OAuth popup + callback
    const popup = window.open("about:blank","_blank","width=520,height=620,left=400,top=100");
    if(popup){
      popup.document.write(`
        <html><head><title>Sign in with Google</title>
        <style>body{font-family:Google Sans,Arial,sans-serif;background:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;margin:0;color:#3c4043}
        .logo{font-size:32px;margin-bottom:16px} h2{font-size:20px;font-weight:400;margin:0 0 8px} p{font-size:14px;color:#5f6368;margin:0 0 32px;text-align:center}
        .acct{display:flex;align-items:center;gap:12px;padding:14px 20px;border:1px solid #dadce0;border-radius:10px;cursor:pointer;margin-bottom:12px;width:320px;transition:background .2s}
        .acct:hover{background:#f8f9fa} .avatar{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#4285f4,#34a853);display:flex;align-items:center;justify-content:center;color:#fff;font-size:14px;font-weight:600}
        .info{text-align:left} .name{font-size:14px;font-weight:500} .email{font-size:12px;color:#5f6368}
        .allow-btn{width:320px;padding:12px;background:#1a73e8;color:#fff;border:none;border-radius:6px;font-size:14px;cursor:pointer;transition:background .2s}
        .allow-btn:hover{background:#1557b0} .perms{font-size:12px;color:#5f6368;text-align:center;margin-top:8px}
        </style></head><body>
        <div class="logo">G</div>
        <h2>Sign in with Google</h2>
        <p>Review Copilot wants to access<br>your Google Business Profile</p>
        <div class="acct" onclick="window.close()">
          <div class="avatar">${user.name[0].toUpperCase()}</div>
          <div class="info"><div class="name">${user.name}</div><div class="email">${user.email}</div></div>
        </div>
        <button class="allow-btn" onclick="window.close()">Allow access</button>
        <p class="perms">By continuing, you allow access to your Google Business Profile</p>
        </body></html>
      `);
      setAuthWindow(popup);
    }
    // Animate progress bar
    let p = 0;
    const interval = setInterval(()=>{
      p += Math.random() * 12;
      if(p >= 100){ p = 100; clearInterval(interval); setTimeout(()=>setStep("success"), 400); }
      setProgress(Math.min(p, 100));
    }, 180);
    // Auto-complete after 3.5s regardless of popup
    setTimeout(()=>{ clearInterval(interval); setProgress(100); setTimeout(()=>setStep("success"), 400); }, 3500);
  };

  const finish = () => {
    const users = getUsers();
    const updated = users.map(u => u.id===user.id ? {...u, googleConnected:true, googleAccount:user.email, googleConnectedAt:new Date().toISOString()} : u);
    saveUsers(updated);
    const updatedUser = {...user, googleConnected:true, googleAccount:user.email, googleConnectedAt:new Date().toISOString()};
    saveSession(updatedUser);
    onConnected(updatedUser);
  };

  return (
    <div style={{minHeight:"100vh",background:"#0d0d14",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",fontFamily:"Georgia,serif",padding:"24px 0"}}>
      <style>{GLOBAL_CSS}</style>
      <AuthBG/>
      <div className="auth-in" style={{width:"100%",maxWidth:500,padding:"0 24px",position:"relative",zIndex:1}}>
        <AuthLogo/>

        {step==="intro" && (
          <div style={{background:"#13131f",border:"1px solid #1e1e2e",borderRadius:16,padding:"36px 36px 32px"}}>
            <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:28}}>
              <div style={{width:52,height:52,borderRadius:14,background:"linear-gradient(135deg,#4285f430,#34a85330)",border:"1px solid #4285f440",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>G</div>
              <div>
                <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:22,fontWeight:300,color:"#e8e4da"}}>Connect Google Business</div>
                <div style={{fontFamily:"DM Mono,monospace",fontSize:9,color:"#444",marginTop:3}}>One-time setup · takes 30 seconds</div>
              </div>
            </div>

            <div style={{fontFamily:"DM Mono,monospace",fontSize:9,color:"#555",letterSpacing:1,textTransform:"uppercase",marginBottom:14}}>Permissions requested</div>
            <div style={{background:"#0d0d14",border:"1px solid #1e1e2e",borderRadius:10,padding:"6px 16px",marginBottom:24}}>
              {GOOGLE_PERMISSIONS.map((p,i)=>(
                <div key={i} className="perm-row">
                  <div style={{width:32,height:32,borderRadius:8,background:`${p.color}15`,border:`1px solid ${p.color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>{p.icon}</div>
                  <div>
                    <div style={{fontFamily:"DM Mono,monospace",fontSize:10,color:"#ccc",marginBottom:3}}>{p.title}</div>
                    <div style={{fontFamily:"DM Mono,monospace",fontSize:9,color:"#555",lineHeight:1.6}}>{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{padding:"12px 16px",background:"#c8a96e08",border:"1px solid #c8a96e20",borderRadius:8,marginBottom:24,fontFamily:"DM Mono,monospace",fontSize:9,color:"#c8a96e80",lineHeight:1.7}}>
              🔒 Your credentials are handled securely via Google OAuth 2.0. Review Copilot never stores your Google password.
            </div>

            <button className="goog-btn" onClick={startAuth}>
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continue with Google
            </button>

            <div style={{textAlign:"center",marginTop:20}}>
              <button className="auth-link" onClick={onSkip} style={{fontSize:9,color:"#444"}}>Skip for now — connect later in Settings</button>
            </div>
          </div>
        )}

        {step==="authorizing" && (
          <div className="fi" style={{background:"#13131f",border:"1px solid #1e1e2e",borderRadius:16,padding:"48px 36px",textAlign:"center"}}>
            <div style={{fontSize:40,marginBottom:20}}>G</div>
            <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:22,fontWeight:300,color:"#e8e4da",marginBottom:8}}>Connecting to Google…</div>
            <div style={{fontFamily:"DM Mono,monospace",fontSize:9,color:"#555",marginBottom:28}}>Complete authorization in the popup window</div>
            <div style={{height:4,background:"#1e1e2e",borderRadius:2,overflow:"hidden",marginBottom:12}}>
              <div style={{height:"100%",width:`${progress}%`,background:"linear-gradient(90deg,#4285f4,#34a853,#c8a96e)",borderRadius:2,transition:"width .2s ease"}}/>
            </div>
            <div style={{fontFamily:"DM Mono,monospace",fontSize:9,color:"#444"}}>{Math.round(progress)}% complete</div>
          </div>
        )}

        {step==="success" && (
          <div className="fi" style={{background:"#13131f",border:"1px solid #10b98130",borderRadius:16,padding:"48px 36px",textAlign:"center"}}>
            <div style={{width:64,height:64,borderRadius:"50%",background:"#10b98120",border:"2px solid #10b98140",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,margin:"0 auto 20px"}}>✓</div>
            <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:26,fontWeight:300,color:"#10b981",marginBottom:8}}>Connected!</div>
            <div style={{fontFamily:"DM Mono,monospace",fontSize:10,color:"#555",marginBottom:6}}>Google Business Profile linked successfully</div>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"#10b98110",border:"1px solid #10b98130",borderRadius:20,padding:"5px 14px",marginBottom:28}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:"#10b981"}}/>
              <span style={{fontFamily:"DM Mono,monospace",fontSize:9,color:"#10b981"}}>{user.email}</span>
            </div>
            <div style={{background:"#0d0d14",border:"1px solid #1e1e2e",borderRadius:10,padding:"14px 18px",marginBottom:28,textAlign:"left"}}>
              {["Reviews syncing in real time","AI replies can be posted directly","Insights powered by live data"].map((f,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"6px 0",fontFamily:"DM Mono,monospace",fontSize:9,color:"#888"}}>
                  <span style={{color:"#10b981",fontSize:11}}>✓</span>{f}
                </div>
              ))}
            </div>
            <button className="auth-btn" onClick={finish} style={{marginTop:0}}>Go to Dashboard →</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Reusable Modal ────────────────────────────────────────────────────────────
function Modal({ onClose, children, danger }) {
  return (
    <div className="overlay-in" style={{position:"fixed",inset:0,background:"rgba(0,0,0,.7)",backdropFilter:"blur(4px)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}
      onClick={e=>{ if(e.target===e.currentTarget) onClose(); }}>
      <div className="modal-in" style={{background:"#13131f",border:`1px solid ${danger?"#ef444430":"#2a2a3a"}`,borderRadius:14,padding:"32px",maxWidth:440,width:"100%",position:"relative"}}>
        <button onClick={onClose} style={{position:"absolute",top:16,right:16,background:"none",border:"none",cursor:"pointer",color:"#555",fontSize:18,lineHeight:1}}>×</button>
        {children}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN APP (post-login)
// ═══════════════════════════════════════════════════════════════════════════════
function MainApp({ user: initialUser, onLogout, onDeleteAccount }) {
  const [currentUser, setCurrentUser] = useState(initialUser);
  const user = currentUser;
  const [reviews, setReviews]       = useState(DEMO_REVIEWS);
  const [view, setView]             = useState("dashboard");
  const [activeTab, setActiveTab]   = useState("all");
  const [selected, setSelected]     = useState(null);
  const [genReply, setGenReply]     = useState("");
  const [editReply, setEditReply]   = useState("");
  const [isGen, setIsGen]           = useState(false);
  const [tone, setTone]             = useState("professional");
  const [biz, setBiz]               = useState(initialUser.biz||"Bella Vista Restaurant");
  const [bizType, setBizType]       = useState(initialUser.bizType||"Restaurant");
  const [dots, setDots]             = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [toast, setToast]           = useState("");
  const [toastType, setToastType]   = useState("success");

  // Google connection state (live from user record)
  const [googleConnected, setGoogleConnected] = useState(!!initialUser.googleConnected);
  const [googleAccount, setGoogleAccount]     = useState(initialUser.googleAccount||"");
  const [showReconnectScreen, setShowReconnectScreen] = useState(false);

  // Modals
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal]         = useState(false);
  const [deleteConfirmText, setDeleteConfirmText]     = useState("");
  const [deleteLoading, setDeleteLoading]             = useState(false);

  // Global period filter
  const [gPeriod, setGPeriod]       = useState(TIME_PERIODS[6]);
  const [gFrom, setGFrom]           = useState("");
  const [gTo, setGTo]               = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Insights
  const [iPeriod, setIPeriod]       = useState(TIME_PERIODS[2]);
  const [iFrom, setIFrom]           = useState("");
  const [iTo, setITo]               = useState("");
  const [iData, setIData]           = useState(null);
  const [iLoading, setILoading]     = useState(false);

  // Notifications
  const [nEmail, setNEmail]         = useState(user.email||"");
  const [nEnabled, setNEnabled]     = useState(false);
  const [nNeg, setNNeg]             = useState(true);
  const [nNeu, setNNeu]             = useState(false);
  const [nAll, setNAll]             = useState(false);
  const [nSaved, setNSaved]         = useState(false);

  // Auto-reply
  const [arEnabled, setArEnabled]   = useState(false);
  const [arPos, setArPos]           = useState(true);
  const [arNeu, setArNeu]           = useState(false);
  const [arNeg, setArNeg]           = useState(false);
  const [arTone, setArTone]         = useState("professional");
  const [arSaved, setArSaved]       = useState(false);
  const [arRunning, setArRunning]   = useState(false);
  const [arLog, setArLog]           = useState([]);

  const showToast = (msg, type="success") => { setToastType(type); setToast(msg); setTimeout(()=>setToast(""),3000); };

  const handleGoogleConnected = (updatedUser) => {
    setCurrentUser(updatedUser);
    setGoogleConnected(true);
    setGoogleAccount(updatedUser.googleAccount||updatedUser.email);
    setShowReconnectScreen(false);
    showToast("✓ Google Business Profile connected");
  };

  const handleDisconnect = () => {
    const users = getUsers();
    const updated = users.map(u => u.id===user.id ? {...u, googleConnected:false, googleAccount:""} : u);
    saveUsers(updated);
    const updatedUser = {...user, googleConnected:false, googleAccount:""};
    saveSession(updatedUser);
    setCurrentUser(updatedUser);
    setGoogleConnected(false);
    setGoogleAccount("");
    setShowDisconnectModal(false);
    showToast("Google account disconnected", "error");
  };

  const handleDeleteAccount = async () => {
    if(deleteConfirmText !== user.email) return;
    setDeleteLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const users = getUsers().filter(u => u.id !== user.id);
    saveUsers(users);
    clearSession();
    setDeleteLoading(false);
    onDeleteAccount();
  };

  useEffect(()=>{
    if(!isGen) return;
    const i=setInterval(()=>setDots(d=>d.length>=3?"":d+"."),400);
    return()=>clearInterval(i);
  },[isGen]);

  useEffect(()=>{
    if(!showDatePicker) return;
    const h=(e)=>{ if(!e.target.closest(".period-dropdown")&&!e.target.closest(".period-btn")) setShowDatePicker(false); };
    document.addEventListener("mousedown",h);
    return()=>document.removeEventListener("mousedown",h);
  },[showDatePicker]);

  useEffect(()=>{
    if(!showUserMenu) return;
    const h=(e)=>{ if(!e.target.closest(".user-menu")) setShowUserMenu(false); };
    document.addEventListener("mousedown",h);
    return()=>document.removeEventListener("mousedown",h);
  },[showUserMenu]);

  const periodReviews = filterByPeriod(reviews,gPeriod,gFrom,gTo);
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

  const callClaude = async(system,user_,maxTokens=1000)=>{
    const res=await fetch("/api/claude",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:maxTokens,system,messages:[{role:"user",content:user_}]})});
    const data=await res.json(); return data.content?.[0]?.text||"";
  };
  const generateReply=async(review)=>{
    setIsGen(true);setGenReply("");setEditReply("");
    try{ const t=await callClaude(`You are a ${tone} customer service expert for ${biz}, a ${bizType}. Write a concise genuine Google review response (2-4 sentences). Be specific. Never use "We value your feedback." Sign off with business name. ONLY the reply text.`,`Write a response to this ${review.rating}-star review: "${review.text}"`);
    setGenReply(t);setEditReply(t);}catch{setGenReply("Error generating reply.");setEditReply("Error generating reply.");}
    setIsGen(false);
  };
  const sendReply=()=>{
    setReviews(p=>p.map(r=>r.id===selected.id?{...r,replied:true,reply:editReply}:r));
    setSelected(p=>({...p,replied:true,reply:editReply}));
    setGenReply("");setEditReply("");showToast("✓ Reply posted");
  };
  const toggleFlag=(id)=>{
    setReviews(p=>p.map(r=>r.id===id?{...r,flagged:!r.flagged}:r));
    if(selected?.id===id) setSelected(p=>({...p,flagged:!p.flagged}));
  };
  const generateInsights=async()=>{
    const subset=filterByPeriod(reviews,iPeriod,iFrom,iTo);
    if(!subset.length){setIData({empty:true});return;}
    setILoading(true);setIData(null);
    const rvText=subset.map(r=>`[${r.rating}★] ${r.author}: "${r.text}"`).join("\n");
    try{const raw=await callClaude(`You are a business intelligence analyst. Analyze Google reviews for ${biz} (${bizType}) and return ONLY valid JSON:
{"goingRight":["p1","p2","p3"],"goingWrong":["p1","p2","p3"],"improvements":["p1","p2","p3"],"summary":"2 sentence executive summary","topTheme":"5 words max","urgency":"low|medium|high"}`,`Analyze these ${subset.length} reviews:\n${rvText}`,1500);
    const clean=raw.replace(/```json|```/g,"").trim();setIData({...JSON.parse(clean),count:subset.length,avgRating:(subset.reduce((a,r)=>a+r.rating,0)/subset.length).toFixed(1)});}
    catch{setIData({error:true});}
    setILoading(false);
  };
  const runAutoReply=async()=>{
    const types=[];if(arPos)types.push("positive");if(arNeu)types.push("neutral");if(arNeg)types.push("negative");
    const candidates=reviews.filter(r=>!r.replied&&types.includes(r.sentiment)).slice(0,3);
    if(!candidates.length){setArLog([{msg:"No unreplied reviews match selected types.",type:"info"}]);return;}
    setArRunning(true);setArLog([]);
    for(const rv of candidates){
      setArLog(l=>[...l,{msg:`Processing ${rv.author} (${rv.sentiment})…`,type:"info"}]);
      await new Promise(r=>setTimeout(r,500));
      try{const reply=await callClaude(`You are a ${arTone} customer service expert for ${biz}. Write a concise Google review reply (2-3 sentences). Sign off as ${biz}. ONLY the reply text.`,`Reply to this ${rv.rating}★ review: "${rv.text}"`,400);
      setReviews(p=>p.map(r=>r.id===rv.id?{...r,replied:true,reply}:r));
      setArLog(l=>[...l,{msg:`✓ Auto-replied to ${rv.author}`,type:"success",preview:reply}]);}
      catch{setArLog(l=>[...l,{msg:`✗ Failed for ${rv.author}`,type:"error"}]);}
      await new Promise(r=>setTimeout(r,300));
    }
    setArRunning(false);
  };

  const initials = user.name.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2);

  // If user clicks Reconnect in settings, show the full-page connect screen
  if(showReconnectScreen) {
    return <GoogleConnectScreen user={user} onConnected={handleGoogleConnected} onSkip={()=>setShowReconnectScreen(false)}/>;
  }

  return (
    <div style={{fontFamily:"Georgia,'Times New Roman',serif",background:"#0d0d14",minHeight:"100vh",color:"#e8e4da"}}>
      <style>{GLOBAL_CSS}</style>
      {toast&&<div className={toastType==="error"?"error-toast":"success-toast"}>{toast}</div>}

      {/* Disconnect Confirmation Modal */}
      {showDisconnectModal && (
        <Modal onClose={()=>setShowDisconnectModal(false)} danger>
          <div style={{textAlign:"center",marginBottom:24}}>
            <div style={{width:52,height:52,borderRadius:"50%",background:"#ef444415",border:"1px solid #ef444430",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,margin:"0 auto 16px"}}>⚠</div>
            <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:22,fontWeight:300,color:"#ef4444",marginBottom:8}}>Disconnect Google Account?</div>
            <div style={{fontFamily:"DM Mono,monospace",fontSize:10,color:"#555",lineHeight:1.8}}>
              This will revoke Review Copilot's access to your Google Business Profile. Reviews will switch to demo mode and auto-replies will stop posting to Google.
            </div>
          </div>
          <div style={{background:"#ef444410",border:"1px solid #ef444420",borderRadius:8,padding:"12px 16px",marginBottom:24}}>
            {[{icon:"✗",text:"Live review syncing will stop"},{icon:"✗",text:"AI replies won't post to Google"},{icon:"✓",text:"Your Review Copilot data is preserved"}].map((r,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"5px 0",fontFamily:"DM Mono,monospace",fontSize:9,color:r.icon==="✓"?"#10b981":"#ef4444"}}>
                <span>{r.icon}</span>{r.text}
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:10}}>
            <button className="btn ghost" style={{flex:1}} onClick={()=>setShowDisconnectModal(false)}>Cancel</button>
            <button className="btn" style={{flex:1,background:"#ef444420",color:"#ef4444",border:"1px solid #ef444430"}} onClick={handleDisconnect}>Yes, Disconnect</button>
          </div>
        </Modal>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <Modal onClose={()=>{setShowDeleteModal(false);setDeleteConfirmText("");}} danger>
          <div style={{textAlign:"center",marginBottom:24}}>
            <div style={{width:52,height:52,borderRadius:"50%",background:"#ef444415",border:"1px solid #ef444430",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,margin:"0 auto 16px"}}>🗑</div>
            <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:22,fontWeight:300,color:"#ef4444",marginBottom:8}}>Delete Account</div>
            <div style={{fontFamily:"DM Mono,monospace",fontSize:10,color:"#555",lineHeight:1.8}}>
              This is permanent and cannot be undone. All your data, settings, and review history will be deleted immediately.
            </div>
          </div>
          <div style={{background:"#ef444408",border:"1px solid #ef444420",borderRadius:8,padding:"14px 16px",marginBottom:20}}>
            <div style={{fontFamily:"DM Mono,monospace",fontSize:9,color:"#ef4444",marginBottom:12,lineHeight:1.6}}>The following will be permanently deleted:</div>
            {["Your account and profile","Business settings and configuration","All notification & auto-reply settings","Review Copilot session and history"].map((item,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"4px 0",fontFamily:"DM Mono,monospace",fontSize:9,color:"#888"}}>
                <span style={{color:"#ef4444"}}>·</span>{item}
              </div>
            ))}
          </div>
          <div style={{marginBottom:20}}>
            <div style={{fontFamily:"DM Mono,monospace",fontSize:9,color:"#666",marginBottom:8,lineHeight:1.6}}>
              Type your email address to confirm: <span style={{color:"#ef4444"}}>{user.email}</span>
            </div>
            <input className="del-input" placeholder={user.email} value={deleteConfirmText} onChange={e=>setDeleteConfirmText(e.target.value)}/>
          </div>
          <div style={{display:"flex",gap:10}}>
            <button className="btn ghost" style={{flex:1}} onClick={()=>{setShowDeleteModal(false);setDeleteConfirmText("");}}>Cancel</button>
            <button className="btn" disabled={deleteConfirmText!==user.email||deleteLoading}
              style={{flex:1,background:deleteConfirmText===user.email?"#ef4444":"#ef444420",color:deleteConfirmText===user.email?"#fff":"#ef444460",border:"1px solid #ef444430",opacity:deleteLoading?0.6:1,cursor:deleteConfirmText!==user.email?"not-allowed":"pointer",transition:"all .2s"}}
              onClick={handleDeleteAccount}>
              {deleteLoading?<><span className="sp" style={{marginRight:6,fontSize:9}}>◌</span>Deleting…</>:"Delete My Account"}
            </button>
          </div>
        </Modal>
      )}

      <div style={{display:"flex",height:"100vh"}}>
        {/* Sidebar */}
        <div style={{width:215,background:"#0a0a10",borderRight:"1px solid #1a1a28",display:"flex",flexDirection:"column",padding:"22px 10px",flexShrink:0}}>
          <div style={{padding:"0 8px 22px",borderBottom:"1px solid #1a1a28"}}>
            <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:22,fontWeight:300,color:"#c8a96e",letterSpacing:1}}>Review</div>
            <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:22,fontWeight:300,letterSpacing:1}}>Copilot</div>
            <div style={{fontFamily:"DM Mono,monospace",fontSize:8,color:"#333",letterSpacing:2,marginTop:3,textTransform:"uppercase"}}>AI-Powered</div>
          </div>
          <div style={{marginTop:18,flex:1}}>
            {[{id:"dashboard",label:"Dashboard",icon:"⬡"},{id:"reviews",label:"Reviews",icon:"◈"},{id:"insights",label:"Insights",icon:"◉"},{id:"settings",label:"Settings",icon:"◎"}].map(item=>(
              <button key={item.id} className={`nav${view===item.id?" on":""}`} onClick={()=>setView(item.id)}>
                <span style={{fontSize:14}}>{item.icon}</span>{item.label}
                {item.id==="reviews"&&stats.unreplied>0&&<span style={{marginLeft:"auto",background:"#c8a96e",color:"#0d0d14",borderRadius:10,padding:"1px 7px",fontSize:8,fontWeight:600}}>{stats.unreplied}</span>}
              </button>
            ))}
          </div>
          <div style={{padding:"10px 8px",borderTop:"1px solid #1a1a28"}}>
            <Label>Business</Label>
            <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:13,color:"#888"}}>{biz}</div>
            <div style={{fontFamily:"DM Mono,monospace",fontSize:9,color:"#444",marginTop:2}}>{bizType}</div>
            {arEnabled&&<div style={{marginTop:8,display:"flex",alignItems:"center",gap:5,fontFamily:"DM Mono,monospace",fontSize:8,color:"#10b981"}}><span className="sp" style={{fontSize:9}}>◌</span>Auto-Reply On</div>}
          </div>
        </div>

        {/* Main */}
        <div style={{flex:1,overflow:"auto",display:"flex",flexDirection:"column"}}>
          <div style={{padding:"14px 28px",borderBottom:"1px solid #1a1a28",display:"flex",alignItems:"center",justifyContent:"space-between",background:"#0d0d14",position:"sticky",top:0,zIndex:20}}>
            <div>
              <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:24,fontWeight:300}}>{{dashboard:"Overview",reviews:"All Reviews",insights:"Business Insights",settings:"Settings"}[view]}</div>
              <div style={{fontFamily:"DM Mono,monospace",fontSize:9,color:"#444",letterSpacing:1,marginTop:2}}>{{dashboard:"Google Review Management",reviews:`${stats.total} reviews in period · ${stats.unreplied} awaiting reply`,insights:"AI-powered analysis of your reviews",settings:"Configure your copilot"}[view]}</div>
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              {/* Period filter */}
              {(view==="dashboard"||view==="reviews")&&(
                <div style={{position:"relative"}}>
                  <button className={`period-btn${gPeriod.days!==1095||gFrom?"active-period":""}`} onClick={()=>setShowDatePicker(p=>!p)}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    {gPeriod.days===null?(gFrom&&gTo?`${gFrom} → ${gTo}`:"Custom Date"):gPeriod.label}
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{opacity:.5}}><polyline points="6 9 12 15 18 9"/></svg>
                  </button>
                  {showDatePicker&&(
                    <div className="period-dropdown">
                      {TIME_PERIODS.filter(p=>p.days!==null).map(p=>(
                        <button key={p.label} className={`period-opt${gPeriod.label===p.label?" sel-opt":""}`} onClick={()=>{setGPeriod(p);setGFrom("");setGTo("");setShowDatePicker(false);}}>
                          {gPeriod.label===p.label?"✓ ":""}{p.label}
                        </button>
                      ))}
                      <button className={`period-opt${gPeriod.days===null?" sel-opt":""}`} onClick={()=>setGPeriod(TIME_PERIODS.find(p=>p.days===null))}>
                        {gPeriod.days===null?"✓ ":""}Custom Date…
                      </button>
                      {gPeriod.days===null&&(
                        <div className="custom-date-row">
                          <div style={{flex:1}}><div style={{fontFamily:"DM Mono,monospace",fontSize:8,color:"#444",letterSpacing:1,marginBottom:4}}>FROM</div><input type="date" value={gFrom} onChange={e=>setGFrom(e.target.value)} style={{fontSize:10,padding:"6px 8px"}}/></div>
                          <div style={{flex:1}}><div style={{fontFamily:"DM Mono,monospace",fontSize:8,color:"#444",letterSpacing:1,marginBottom:4}}>TO</div><input type="date" value={gTo} onChange={e=>setGTo(e.target.value)} style={{fontSize:10,padding:"6px 8px"}}/></div>
                          <div style={{display:"flex",alignItems:"flex-end"}}><button className="btn gold" style={{fontSize:9,padding:"7px 10px"}} onClick={()=>setShowDatePicker(false)}>Apply</button></div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              {stats.flagged>0&&(view==="dashboard"||view==="reviews")&&<div style={{background:"#ef444413",border:"1px solid #ef444428",borderRadius:6,padding:"5px 11px",fontFamily:"DM Mono,monospace",fontSize:9,color:"#ef4444"}}>⚑ {stats.flagged} flagged</div>}

              {/* User avatar + menu */}
              <div style={{position:"relative"}} className="user-menu">
                <button onClick={()=>setShowUserMenu(s=>!s)} style={{width:34,height:34,borderRadius:"50%",background:"linear-gradient(135deg,#c8a96e,#b8955a)",border:"2px solid #c8a96e40",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"DM Mono,monospace",fontSize:11,color:"#0d0d14",fontWeight:600,transition:"all .2s",flexShrink:0}}>
                  {initials}
                </button>
                {showUserMenu&&(
                  <div className="fi" style={{position:"absolute",top:"calc(100% + 8px)",right:0,background:"#13131f",border:"1px solid #1e1e2e",borderRadius:10,minWidth:220,padding:"8px",zIndex:100,boxShadow:"0 8px 32px rgba(0,0,0,.5)"}}>
                    <div style={{padding:"10px 12px 12px",borderBottom:"1px solid #1e1e2e",marginBottom:6}}>
                      <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:16,color:"#e8e4da"}}>{user.name}</div>
                      <div style={{fontFamily:"DM Mono,monospace",fontSize:9,color:"#555",marginTop:2}}>{user.email}</div>
                      <div style={{display:"inline-flex",alignItems:"center",gap:5,marginTop:6,background:"#c8a96e10",border:"1px solid #c8a96e20",borderRadius:20,padding:"2px 10px"}}>
                        <div style={{width:5,height:5,borderRadius:"50%",background:"#10b981"}}/>
                        <span style={{fontFamily:"DM Mono,monospace",fontSize:8,color:"#c8a96e"}}>Active account</span>
                      </div>
                    </div>
                    {[
                      {icon:"◎", label:"Settings", action:()=>{setView("settings");setShowUserMenu(false);}},
                      {icon:"◉", label:"Insights",  action:()=>{setView("insights");setShowUserMenu(false);}},
                    ].map(item=>(
                      <button key={item.label} onClick={item.action} style={{width:"100%",background:"none",border:"none",cursor:"pointer",padding:"9px 12px",borderRadius:6,display:"flex",alignItems:"center",gap:10,fontFamily:"DM Mono,monospace",fontSize:10,color:"#666",transition:"all .2s",textAlign:"left"}}
                        onMouseEnter={e=>{e.currentTarget.style.background="#1a1a28";e.currentTarget.style.color="#aaa";}}
                        onMouseLeave={e=>{e.currentTarget.style.background="none";e.currentTarget.style.color="#666";}}>
                        <span>{item.icon}</span>{item.label}
                      </button>
                    ))}
                    <div style={{borderTop:"1px solid #1e1e2e",marginTop:4,paddingTop:4}}>
                      <button onClick={onLogout} style={{width:"100%",background:"none",border:"none",cursor:"pointer",padding:"9px 12px",borderRadius:6,display:"flex",alignItems:"center",gap:10,fontFamily:"DM Mono,monospace",fontSize:10,color:"#ef4444",transition:"all .2s",textAlign:"left"}}
                        onMouseEnter={e=>{e.currentTarget.style.background="#ef444410";}}
                        onMouseLeave={e=>{e.currentTarget.style.background="none";}}>
                        <span>→</span>Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{padding:"24px 28px",flex:1}}>

            {/* DASHBOARD */}
            {view==="dashboard"&&(
              <div className="fi">
                {gPeriod.days!==1095&&(
                  <div style={{marginBottom:16,display:"flex",alignItems:"center",gap:8}}>
                    <div style={{fontFamily:"DM Mono,monospace",fontSize:9,color:"#c8a96e80",letterSpacing:1}}>SHOWING DATA FOR</div>
                    <div style={{background:"#c8a96e10",border:"1px solid #c8a96e25",borderRadius:20,padding:"3px 12px",fontFamily:"DM Mono,monospace",fontSize:9,color:"#c8a96e"}}>
                      {gPeriod.days===null?(gFrom&&gTo?`${gFrom} → ${gTo}`:"Custom range"):`${gPeriod.label} · ${periodReviews.length} reviews`}
                    </div>
                    <button onClick={()=>{setGPeriod(TIME_PERIODS[6]);setGFrom("");setGTo("");}} style={{background:"none",border:"none",cursor:"pointer",fontFamily:"DM Mono,monospace",fontSize:8,color:"#444",textDecoration:"underline"}}>reset</button>
                  </div>
                )}
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:24}}>
                  {[
                    {l:"Avg Rating",  v:stats.avg,      s:gPeriod.days===1095?"all time":gPeriod.label.toLowerCase(),a:"#c8a96e"},
                    {l:"Total Reviews",v:stats.total,   s:gPeriod.days===1095?"all time":gPeriod.label.toLowerCase(),a:"#7c8cf8"},
                    {l:"Positive",    v:stats.positive, s:stats.total?`${Math.round(stats.positive/stats.total*100)}% of total`:"no data",a:"#10b981"},
                    {l:"Need Reply",  v:stats.unreplied,s:"awaiting response",a:"#ef4444"},
                  ].map(s=>(
                    <div key={s.l} style={{background:"#13131f",border:"1px solid #1e1e2e",borderRadius:10,padding:"18px 20px"}}>
                      <Label>{s.l}</Label>
                      <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:38,fontWeight:300,color:s.a,lineHeight:1}}>{s.v}</div>
                      <div style={{fontFamily:"DM Mono,monospace",fontSize:9,color:"#555",marginTop:5}}>{s.s}</div>
                    </div>
                  ))}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:22}}>
                  <Card style={{marginBottom:0}}>
                    <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:18,fontWeight:300,marginBottom:16}}>Rating Distribution</div>
                    {periodReviews.length===0?(<div style={{fontFamily:"Georgia,serif",fontSize:13,color:"#444",fontStyle:"italic",textAlign:"center",padding:"20px 0"}}>No reviews in this period</div>)
                    :[5,4,3,2,1].map(star=>{const c=periodReviews.filter(r=>r.rating===star).length,p=Math.round(c/periodReviews.length*100);return(
                      <div key={star} style={{display:"flex",alignItems:"center",gap:10,marginBottom:9}}>
                        <Stars rating={star} size={11}/><div style={{flex:1,height:6,background:"#1e1e2e",borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:`${p}%`,background:star>=4?"#10b981":star===3?"#f59e0b":"#ef4444",borderRadius:3}}/></div>
                        <div style={{fontFamily:"DM Mono,monospace",fontSize:9,color:"#555",width:16,textAlign:"right"}}>{c}</div>
                      </div>
                    );})}
                  </Card>
                  <Card style={{marginBottom:0}}>
                    <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:18,fontWeight:300,marginBottom:16}}>Sentiment & Response</div>
                    {periodReviews.length===0?(<div style={{fontFamily:"Georgia,serif",fontSize:13,color:"#444",fontStyle:"italic",textAlign:"center",padding:"20px 0"}}>No reviews in this period</div>):(
                      <>
                        {["positive","neutral","negative"].map(s=>{const c=periodReviews.filter(r=>r.sentiment===s).length,p=Math.round(c/periodReviews.length*100);return(
                          <div key={s} style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                            <div style={{width:7,height:7,borderRadius:"50%",background:SC[s]}}/><div style={{fontFamily:"DM Mono,monospace",fontSize:9,color:"#888",width:55,textTransform:"capitalize"}}>{s}</div>
                            <div style={{flex:1,height:5,background:"#1e1e2e",borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:`${p}%`,background:SC[s],borderRadius:3}}/></div>
                            <div style={{fontFamily:"DM Mono,monospace",fontSize:9,color:"#555"}}>{p}%</div>
                          </div>
                        );})}
                        <div style={{marginTop:16,paddingTop:14,borderTop:"1px solid #1e1e2e"}}>
                          <Label>Response Rate</Label>
                          <div style={{display:"flex",alignItems:"center",gap:10}}>
                            <div style={{flex:1,height:7,background:"#1e1e2e",borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",width:`${Math.round(periodReviews.filter(r=>r.replied).length/periodReviews.length*100)}%`,background:"linear-gradient(90deg,#c8a96e,#d4b87a)",borderRadius:4}}/></div>
                            <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:20,color:"#c8a96e"}}>{Math.round(periodReviews.filter(r=>r.replied).length/periodReviews.length*100)}%</div>
                          </div>
                        </div>
                      </>
                    )}
                  </Card>
                </div>
                <div style={{background:"linear-gradient(135deg,#c8a96e0d,#7c8cf80d)",border:"1px solid #c8a96e1e",borderRadius:10,padding:"20px 26px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:20}}>
                  <div>
                    <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:20,color:"#c8a96e",marginBottom:4}}>✦ AI Business Insights</div>
                    <div style={{fontFamily:"DM Mono,monospace",fontSize:9,color:"#555"}}>What's going right, wrong, and how to improve</div>
                  </div>
                  <button className="btn gold" style={{whiteSpace:"nowrap"}} onClick={()=>setView("insights")}>Open Insights →</button>
                </div>
              </div>
            )}

            {/* REVIEWS */}
            {view==="reviews"&&(
              <div className="fi" style={{display:"flex",gap:18,height:"calc(100vh - 120px)"}}>
                <div style={{width:345,flexShrink:0,display:"flex",flexDirection:"column"}}>
                  {gPeriod.days!==1095&&(
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10,padding:"7px 12px",background:"#c8a96e08",border:"1px solid #c8a96e20",borderRadius:7}}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#c8a96e" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      <span style={{fontFamily:"DM Mono,monospace",fontSize:9,color:"#c8a96e",flex:1}}>{gPeriod.days===null?(gFrom&&gTo?`${gFrom} → ${gTo}`:"Custom range"):gPeriod.label}{" · "}{periodReviews.length} review{periodReviews.length!==1?"s":""}</span>
                      <button onClick={()=>{setGPeriod(TIME_PERIODS[6]);setGFrom("");setGTo("");}} style={{background:"none",border:"none",cursor:"pointer",fontFamily:"DM Mono,monospace",fontSize:8,color:"#555",textDecoration:"underline"}}>clear</button>
                    </div>
                  )}
                  <div style={{display:"flex",gap:3,marginBottom:12,background:"#13131f",borderRadius:7,padding:3}}>
                    {[{id:"all",l:"All"},{id:"unreplied",l:"New"},{id:"flagged",l:"Flagged"},{id:"replied",l:"Replied"}].map(t=>(
                      <button key={t.id} className={`tab${activeTab===t.id?" on":""}`} style={{flex:1}} onClick={()=>setActiveTab(t.id)}>{t.l}</button>
                    ))}
                  </div>
                  <div style={{flex:1,overflow:"auto",display:"flex",flexDirection:"column",gap:7}}>
                    {filtered.length===0?(
                      <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flex:1,gap:8,padding:"40px 0"}}>
                        <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:32,color:"#1e1e2e"}}>◈</div>
                        <div style={{fontFamily:"Georgia,serif",fontSize:13,color:"#444",fontStyle:"italic",textAlign:"center"}}>No reviews found<br/>for this period</div>
                      </div>
                    ):filtered.map(r=>(
                      <div key={r.id} className={`rc${selected?.id===r.id?" sel":""}`} onClick={()=>{setSelected(r);setGenReply("");setEditReply("");}}>
                        <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:8}}>
                          <div style={{width:30,height:30,borderRadius:"50%",background:SB[r.sentiment],display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"DM Mono,monospace",fontSize:9,color:SC[r.sentiment],flexShrink:0}}>{r.avatar}</div>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                              <span style={{fontFamily:"DM Mono,monospace",fontSize:10,color:"#ccc"}}>{r.author}</span>
                              <span style={{fontFamily:"DM Mono,monospace",fontSize:8,color:"#444"}}>{new Date(r.date).toLocaleDateString()}</span>
                            </div>
                            <div style={{display:"flex",alignItems:"center",gap:5,marginTop:3}}>
                              <Stars rating={r.rating} size={10}/>
                              {r.flagged&&<span style={{fontFamily:"DM Mono,monospace",fontSize:7,color:"#ef4444",background:"#ef444415",padding:"1px 5px",borderRadius:3}}>FLAGGED</span>}
                              {r.replied&&<span style={{fontFamily:"DM Mono,monospace",fontSize:7,color:"#10b981",background:"#10b98115",padding:"1px 5px",borderRadius:3}}>REPLIED</span>}
                            </div>
                          </div>
                        </div>
                        <div style={{fontFamily:"Georgia,serif",fontSize:12,color:"#666",lineHeight:1.5,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{r.text}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{flex:1,overflow:"auto"}}>
                  {!selected?(
                    <div style={{height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10}}>
                      <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:46,color:"#1e1e2e"}}>◈</div>
                      <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:20,color:"#333",fontStyle:"italic"}}>Select a review to respond</div>
                    </div>
                  ):(
                    <div className="fi">
                      <Card>
                        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:16,marginBottom:14}}>
                          <div style={{display:"flex",alignItems:"center",gap:12}}>
                            <div style={{width:42,height:42,borderRadius:"50%",background:SB[selected.sentiment],display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"DM Mono,monospace",fontSize:12,color:SC[selected.sentiment],border:`1px solid ${SC[selected.sentiment]}30`}}>{selected.avatar}</div>
                            <div>
                              <div style={{fontFamily:"DM Mono,monospace",fontSize:12,color:"#ddd"}}>{selected.author}</div>
                              <div style={{display:"flex",alignItems:"center",gap:8,marginTop:3}}><Stars rating={selected.rating} size={12}/><span style={{fontFamily:"DM Mono,monospace",fontSize:8,color:"#444"}}>{new Date(selected.date).toLocaleDateString()}</span></div>
                            </div>
                          </div>
                          <button className="btn ghost" style={{fontSize:9,padding:"6px 12px",color:selected.flagged?"#ef4444":"#555",borderColor:selected.flagged?"#ef444430":"#2a2a3a"}} onClick={()=>toggleFlag(selected.id)}>{selected.flagged?"⚑ Unflag":"⚑ Flag"}</button>
                        </div>
                        <div style={{fontFamily:"Georgia,serif",fontSize:15,color:"#aaa",lineHeight:1.7,padding:"14px 0",borderTop:"1px solid #1e1e2e",borderBottom:selected.replied?"1px solid #1e1e2e":"none"}}>"{selected.text}"</div>
                        {selected.replied&&selected.reply&&(
                          <div style={{marginTop:14,padding:"12px 15px",background:"#10b98110",borderLeft:"3px solid #10b981",borderRadius:"0 6px 6px 0"}}>
                            <Label color="#10b981">Your Reply</Label>
                            <div style={{fontFamily:"Georgia,serif",fontSize:13,color:"#888",lineHeight:1.6}}>{selected.reply}</div>
                          </div>
                        )}
                      </Card>
                      {!selected.replied&&(
                        <Card>
                          <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:20,fontWeight:300,marginBottom:16}}>Generate AI Reply</div>
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
                          {isGen&&<div className="pulse" style={{fontFamily:"Georgia,serif",fontSize:13,color:"#555",fontStyle:"italic",padding:"14px 0"}}>Crafting the perfect response…</div>}
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

            {/* INSIGHTS */}
            {view==="insights"&&(
              <div className="fi">
                <Card>
                  <div style={{display:"flex",alignItems:"flex-end",gap:14,flexWrap:"wrap"}}>
                    <div style={{flex:1,minWidth:180}}>
                      <Label>Time Period</Label>
                      <select value={iPeriod.label} onChange={e=>{setIPeriod(TIME_PERIODS.find(t=>t.label===e.target.value));setIData(null);}}>
                        {TIME_PERIODS.map(p=><option key={p.label} value={p.label}>{p.label}</option>)}
                      </select>
                    </div>
                    {iPeriod.days===null&&(
                      <>
                        <div><Label>From</Label><input type="date" value={iFrom} onChange={e=>setIFrom(e.target.value)} style={{width:155}}/></div>
                        <div><Label>To</Label><input type="date" value={iTo} onChange={e=>setITo(e.target.value)} style={{width:155}}/></div>
                      </>
                    )}
                    <button className="btn gold" onClick={generateInsights} disabled={iLoading} style={{opacity:iLoading?.7:1,whiteSpace:"nowrap"}}>
                      {iLoading?<><span className="sp" style={{marginRight:6,fontSize:10}}>◌</span>Analysing…</>:"✦ Generate Insights"}
                    </button>
                  </div>
                  {(()=>{
                    const sub=filterByPeriod(reviews,iPeriod,iFrom,iTo);
                    return(
                      <div style={{display:"flex",gap:10,marginTop:16,flexWrap:"wrap"}}>
                        {[{l:"Reviews in period",v:sub.length,a:"#7c8cf8"},{l:"Avg rating",v:(sub.reduce((a,r)=>a+r.rating,0)/(sub.length||1)).toFixed(1),a:"#c8a96e"},{l:"Positive",v:sub.filter(r=>r.sentiment==="positive").length,a:"#10b981"},{l:"Negative",v:sub.filter(r=>r.sentiment==="negative").length,a:"#ef4444"}].map(p=>(
                          <div key={p.l} style={{background:"#0d0d14",border:"1px solid #1e1e2e",borderRadius:8,padding:"9px 15px",textAlign:"center"}}>
                            <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:24,fontWeight:300,color:p.a}}>{p.v}</div>
                            <div style={{fontFamily:"DM Mono,monospace",fontSize:8,color:"#444",marginTop:2}}>{p.l}</div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </Card>
                {iLoading&&(<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"70px 0",gap:14}}><div className="pulse" style={{fontFamily:"Cormorant Garamond,serif",fontSize:50,color:"#c8a96e30"}}>◉</div><div style={{fontFamily:"Cormorant Garamond,serif",fontSize:20,color:"#555",fontStyle:"italic"}}>Analysing your reviews…</div></div>)}
                {iData&&!iData.empty&&!iData.error&&!iLoading&&(
                  <div className="fi">
                    <div style={{background:"linear-gradient(135deg,#c8a96e10,#7c8cf80e)",border:"1px solid #c8a96e22",borderRadius:10,padding:"18px 24px",marginBottom:20,display:"flex",alignItems:"center",gap:18}}>
                      <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:38,color:"#c8a96e",lineHeight:1,flexShrink:0}}>✦</div>
                      <div style={{flex:1}}>
                        <Label color="#c8a96e80">Executive Summary · {iData.count} reviews · {iData.avgRating}★ avg</Label>
                        <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:16,color:"#ccc",lineHeight:1.6}}>{iData.summary}</div>
                        {iData.topTheme&&(<div style={{marginTop:10,display:"inline-flex",alignItems:"center",gap:8,background:"#c8a96e12",border:"1px solid #c8a96e28",borderRadius:20,padding:"4px 13px"}}><span style={{fontFamily:"DM Mono,monospace",fontSize:8,color:"#c8a96e",letterSpacing:1}}>TOP THEME</span><span style={{fontFamily:"Georgia,serif",fontSize:12,color:"#e8e4da"}}>{iData.topTheme}</span></div>)}
                      </div>
                      {iData.urgency&&(<div style={{flexShrink:0,textAlign:"center",padding:"8px 16px",background:iData.urgency==="high"?"#ef444415":iData.urgency==="medium"?"#f59e0b15":"#10b98115",borderRadius:8,border:`1px solid ${iData.urgency==="high"?"#ef444430":iData.urgency==="medium"?"#f59e0b30":"#10b98130"}`}}><Label color={iData.urgency==="high"?"#ef4444":iData.urgency==="medium"?"#f59e0b":"#10b981"}>Urgency</Label><div style={{fontFamily:"Cormorant Garamond,serif",fontSize:20,textTransform:"capitalize",color:iData.urgency==="high"?"#ef4444":iData.urgency==="medium"?"#f59e0b":"#10b981"}}>{iData.urgency}</div></div>)}
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:18}}>
                      {[{title:"What's Going Right",sub:"Keep doing these",color:"#10b981",icon:"✓",bg:"#10b98108",border:"#10b98120",items:iData.goingRight,arrow:"↑",tc:"#9ae6c4"},{title:"What's Going Wrong",sub:"Needs attention",color:"#ef4444",icon:"!",bg:"#ef444408",border:"#ef444420",items:iData.goingWrong,arrow:"↓",tc:"#fca5a5"},{title:"How to Improve",sub:"Action items",color:"#c8a96e",icon:"◈",bg:"#c8a96e08",border:"#c8a96e20",items:iData.improvements,arrow:"→",tc:"#e8d5b0"}].map(col=>(
                        <Card key={col.title} style={{marginBottom:0}}>
                          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
                            <div style={{width:30,height:30,background:`${col.color}20`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:col.color}}>{col.icon}</div>
                            <div><div style={{fontFamily:"Cormorant Garamond,serif",fontSize:17,fontWeight:300,color:col.color}}>{col.title}</div><Label>{col.sub}</Label></div>
                          </div>
                          {col.items?.map((item,i)=>(<div key={i} className="ip" style={{background:col.bg,border:`1px solid ${col.border}`}}><span style={{color:col.color,fontSize:13,flexShrink:0,marginTop:1}}>{col.arrow}</span><span style={{color:col.tc,fontSize:13}}>{item}</span></div>))}
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
                {iData?.empty&&<div style={{textAlign:"center",padding:"60px 0",fontFamily:"Cormorant Garamond,serif",fontSize:20,color:"#444",fontStyle:"italic"}}>No reviews found for this period.</div>}
                {iData?.error&&<div style={{textAlign:"center",padding:"60px 0",fontFamily:"Cormorant Garamond,serif",fontSize:20,color:"#ef4444",fontStyle:"italic"}}>Failed to generate insights. Please try again.</div>}
                {!iData&&!iLoading&&(<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"70px 0",gap:10}}><div style={{fontFamily:"Cormorant Garamond,serif",fontSize:50,color:"#1e1e2e"}}>◉</div><div style={{fontFamily:"Cormorant Garamond,serif",fontSize:21,color:"#444",fontStyle:"italic"}}>Select a time period and generate insights</div></div>)}
              </div>
            )}

            {/* SETTINGS */}
            {view==="settings"&&(
              <div className="fi" style={{maxWidth:660}}>
                {/* Account info card */}
                <Card>
                  <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:20,paddingBottom:20,borderBottom:"1px solid #1e1e2e"}}>
                    <div style={{width:52,height:52,borderRadius:"50%",background:"linear-gradient(135deg,#c8a96e,#b8955a)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"DM Mono,monospace",fontSize:16,color:"#0d0d14",fontWeight:600,flexShrink:0}}>{initials}</div>
                    <div>
                      <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:20,fontWeight:300}}>{user.name}</div>
                      <div style={{fontFamily:"DM Mono,monospace",fontSize:9,color:"#555",marginTop:3}}>{user.email}</div>
                      <div style={{fontFamily:"DM Mono,monospace",fontSize:8,color:"#333",marginTop:4}}>Member since {new Date(user.createdAt).toLocaleDateString("en-US",{month:"long",year:"numeric"})}</div>
                    </div>
                    <button className="btn ghost" style={{marginLeft:"auto",fontSize:9,color:"#ef4444",borderColor:"#ef444430"}} onClick={onLogout}>Sign Out</button>
                  </div>
                  <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:18,fontWeight:300,marginBottom:16}}>Business Profile</div>
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
                </Card>

                {/* Notifications */}
                <Card>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
                    <div><div style={{fontFamily:"Cormorant Garamond,serif",fontSize:20,fontWeight:300}}>Email Notifications</div><div style={{fontFamily:"DM Mono,monospace",fontSize:9,color:"#444",marginTop:3}}>Get alerted when reviews match your criteria</div></div>
                    <label className="tog"><input type="checkbox" checked={nEnabled} onChange={e=>setNEnabled(e.target.checked)}/><span className="sli"/></label>
                  </div>
                  <div style={{opacity:nEnabled?1:.4,transition:"opacity .3s",pointerEvents:nEnabled?"auto":"none"}}>
                    <div style={{marginBottom:14}}><Label>Notification Email</Label><input type="email" placeholder="owner@yourbusiness.com" value={nEmail} onChange={e=>setNEmail(e.target.value)}/></div>
                    <Label>Notify me when a review is…</Label>
                    <div style={{display:"flex",flexDirection:"column",gap:9,marginTop:8}}>
                      {[{l:"Negative (1–2 stars)",sub:"Recommended — catch issues fast",v:nNeg,set:setNNeg,a:"#ef4444"},{l:"Neutral (3 stars)",sub:"Track mixed experiences",v:nNeu,set:setNNeu,a:"#f59e0b"},{l:"Any new review",sub:"Get notified for all reviews",v:nAll,set:setNAll,a:"#7c8cf8"}].map(o=>(
                        <div key={o.l} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"11px 14px",background:"#0d0d14",border:`1px solid ${o.v?o.a+"30":"#1e1e2e"}`,borderRadius:8,transition:"border-color .2s"}}>
                          <div><div style={{fontFamily:"DM Mono,monospace",fontSize:10,color:o.v?o.a:"#777"}}>{o.l}</div><div style={{fontFamily:"DM Mono,monospace",fontSize:8,color:"#444",marginTop:2}}>{o.sub}</div></div>
                          <label className="tog"><input type="checkbox" checked={o.v} onChange={e=>o.set(e.target.checked)}/><span className="sli"/></label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{marginTop:18}}><button className="btn gold" onClick={()=>{setNSaved(true);showToast("✓ Notification settings saved");setTimeout(()=>setNSaved(false),2500);}}>{nSaved?"✓ Saved":"Save Notification Settings"}</button></div>
                </Card>

                {/* Auto-Reply */}
                <Card>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
                    <div><div style={{fontFamily:"Cormorant Garamond,serif",fontSize:20,fontWeight:300}}>Auto-Reply Copilot</div><div style={{fontFamily:"DM Mono,monospace",fontSize:9,color:"#444",marginTop:3}}>Automatically generate & post AI replies</div></div>
                    <label className="tog"><input type="checkbox" checked={arEnabled} onChange={e=>setArEnabled(e.target.checked)}/><span className="sli"/></label>
                  </div>
                  <div style={{opacity:arEnabled?1:.4,transition:"opacity .3s",pointerEvents:arEnabled?"auto":"none"}}>
                    <Label>Auto-reply to reviews that are…</Label>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:16,marginTop:8}}>
                      {[{l:"Positive",sub:"4–5 stars",v:arPos,set:setArPos,c:"#10b981",ic:"✓"},{l:"Neutral",sub:"3 stars",v:arNeu,set:setArNeu,c:"#f59e0b",ic:"~"},{l:"Negative",sub:"1–2 stars",v:arNeg,set:setArNeg,c:"#ef4444",ic:"!"}].map(o=>(
                        <div key={o.l} onClick={()=>o.set(!o.v)} style={{cursor:"pointer",padding:"14px",background:o.v?`${o.c}10`:"#0d0d14",border:`1px solid ${o.v?o.c+"38":"#1e1e2e"}`,borderRadius:9,transition:"all .2s",textAlign:"center"}}>
                          <div style={{width:30,height:30,borderRadius:"50%",background:o.v?`${o.c}18`:"#1e1e2e",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 8px",fontFamily:"DM Mono,monospace",fontSize:13,color:o.v?o.c:"#444",transition:"all .2s"}}>{o.ic}</div>
                          <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:15,color:o.v?o.c:"#555"}}>{o.l}</div>
                          <div style={{fontFamily:"DM Mono,monospace",fontSize:8,color:"#444",marginTop:2}}>{o.sub}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{marginBottom:16}}><Label>Auto-Reply Tone</Label>
                      <select value={arTone} onChange={e=>setArTone(e.target.value)}>
                        <option value="professional">Professional</option><option value="warm and friendly">Warm &amp; Friendly</option>
                        <option value="apologetic and empathetic">Apologetic</option><option value="concise and direct">Concise</option><option value="formal">Formal</option>
                      </select>
                    </div>
                    <div style={{padding:"14px",background:"#0d0d14",border:"1px solid #1e1e2e",borderRadius:8}}>
                      <Label>Simulate Auto-Reply</Label>
                      <div style={{fontFamily:"DM Mono,monospace",fontSize:9,color:"#555",marginBottom:10,lineHeight:1.6}}>Test auto-reply on up to 3 unreplied reviews matching your selected types.</div>
                      <button className="btn grn" onClick={runAutoReply} disabled={arRunning}>{arRunning?<><span className="sp" style={{marginRight:5,fontSize:9}}>◌</span>Running…</>:"▶ Run Simulation"}</button>
                      {arLog.length>0&&(<div className="fi" style={{marginTop:12,display:"flex",flexDirection:"column",gap:5}}>{arLog.map((log,i)=>(<div key={i} style={{padding:"9px 11px",background:log.type==="success"?"#10b98110":log.type==="error"?"#ef444410":"#1e1e2e",borderRadius:6,borderLeft:`3px solid ${log.type==="success"?"#10b981":log.type==="error"?"#ef4444":"#444"}`}}><div style={{fontFamily:"DM Mono,monospace",fontSize:9,color:log.type==="success"?"#10b981":log.type==="error"?"#ef4444":"#666"}}>{log.msg}</div>{log.preview&&<div style={{fontFamily:"Georgia,serif",fontSize:11,color:"#666",marginTop:5,lineHeight:1.5,fontStyle:"italic"}}>"{log.preview.slice(0,130)}{log.preview.length>130?"…":""}"</div>}</div>))}</div>)}
                    </div>
                  </div>
                  <div style={{marginTop:18}}><button className="btn gold" onClick={()=>{setArSaved(true);showToast("✓ Auto-reply settings saved");setTimeout(()=>setArSaved(false),2500);}}>{arSaved?"✓ Saved":"Save Auto-Reply Settings"}</button></div>
                </Card>

                {/* Google Business Profile Card */}
                <Card style={{border: googleConnected ? "1px solid #10b98130" : "1px solid #c8a96e20", background: googleConnected ? "#10b98106" : "#c8a96e05"}}>
                  <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:16}}>
                    <div style={{display:"flex",alignItems:"center",gap:14}}>
                      <div style={{width:44,height:44,borderRadius:12,background:googleConnected?"#10b98115":"linear-gradient(135deg,#4285f420,#34a85320)",border:`1px solid ${googleConnected?"#10b98130":"#4285f430"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>G</div>
                      <div>
                        <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:18,fontWeight:300,color:googleConnected?"#10b981":"#c8a96e"}}>Google Business Profile</div>
                        {googleConnected ? (
                          <div style={{display:"flex",alignItems:"center",gap:6,marginTop:4}}>
                            <div style={{width:6,height:6,borderRadius:"50%",background:"#10b981"}}/>
                            <span style={{fontFamily:"DM Mono,monospace",fontSize:9,color:"#10b981"}}>Connected</span>
                            <span style={{fontFamily:"DM Mono,monospace",fontSize:9,color:"#444",margin:"0 4px"}}>·</span>
                            <span style={{fontFamily:"DM Mono,monospace",fontSize:9,color:"#555"}}>{googleAccount}</span>
                          </div>
                        ) : (
                          <div style={{fontFamily:"DM Mono,monospace",fontSize:9,color:"#555",marginTop:3}}>Not connected · reviews are in demo mode</div>
                        )}
                      </div>
                    </div>
                    {googleConnected ? (
                      <div style={{display:"flex",gap:8,flexShrink:0}}>
                        <button className="btn ghost" style={{fontSize:9,padding:"7px 13px",color:"#7c8cf8",borderColor:"#7c8cf830"}} onClick={()=>setShowReconnectScreen(true)}>Reconnect</button>
                        <button className="btn ghost" style={{fontSize:9,padding:"7px 13px",color:"#ef4444",borderColor:"#ef444430"}} onClick={()=>setShowDisconnectModal(true)}>Disconnect</button>
                      </div>
                    ) : (
                      <button className="btn gold" style={{fontSize:9,padding:"8px 16px",flexShrink:0,whiteSpace:"nowrap"}} onClick={()=>setShowReconnectScreen(true)}>Connect Account →</button>
                    )}
                  </div>
                  {googleConnected && (
                    <div style={{marginTop:16,paddingTop:14,borderTop:"1px solid #10b98118",display:"flex",gap:16,flexWrap:"wrap"}}>
                      {[{l:"Reviews sync",v:"Real-time",c:"#10b981"},{l:"Reply posting",v:"Enabled",c:"#10b981"},{l:"Last sync",v:"Just now",c:"#888"}].map(s=>(
                        <div key={s.l}>
                          <div style={{fontFamily:"DM Mono,monospace",fontSize:8,color:"#444",letterSpacing:1,marginBottom:3}}>{s.l}</div>
                          <div style={{fontFamily:"DM Mono,monospace",fontSize:10,color:s.c}}>{s.v}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>

                {/* Danger Zone — Delete Account */}
                <div style={{background:"#ef444408",border:"1px solid #ef444420",borderRadius:10,padding:"22px 26px",marginTop:6}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                    <span style={{fontSize:14}}>⚠</span>
                    <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:18,color:"#ef4444",fontWeight:300}}>Danger Zone</div>
                  </div>
                  <div style={{fontFamily:"DM Mono,monospace",fontSize:9,color:"#666",lineHeight:1.8,marginBottom:16}}>
                    Permanently delete your Review Copilot account and all associated data. This action cannot be undone.
                  </div>
                  <button className="btn" style={{background:"#ef444415",color:"#ef4444",border:"1px solid #ef444430",fontSize:9,padding:"8px 18px"}} onClick={()=>setShowDeleteModal(true)}>
                    Delete Account
                  </button>
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
// ROOT — Auth Router
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [authView, setAuthView]         = useState("login"); // login | signup | forgot
  const [appView, setAppView]           = useState("auth");  // auth | google-connect | app
  const [user, setUser]                 = useState(()=>{
    // Seed demo account on first load
    const users = getUsers();
    if(!users.find(u=>u.email==="demo@reviewcopilot.com")){
      saveUsers([...users,{id:1,name:"Demo User",email:"demo@reviewcopilot.com",password:"Demo@1234",biz:"Bella Vista Restaurant",bizType:"Restaurant",createdAt:new Date().toISOString(),googleConnected:false}]);
    }
    const session = getSession();
    if(session) return session;
    return null;
  });

  // On mount, if there's a valid session go straight to app
  useEffect(()=>{
    if(user) setAppView("app");
  }, []);

  const handleLogin = (u) => {
    setUser(u);
    // Show Google connect screen only if NOT already connected
    if(!u.googleConnected) {
      setAppView("google-connect");
    } else {
      setAppView("app");
    }
  };

  const handleSignup = (u) => {
    setUser(u);
    // New accounts always go through Google connect
    setAppView("google-connect");
  };

  const handleGoogleConnected = (updatedUser) => {
    setUser(updatedUser);
    setAppView("app");
  };

  const handleSkipGoogle = () => {
    setAppView("app");
  };

  const handleLogout = () => {
    clearSession();
    setUser(null);
    setAppView("auth");
    setAuthView("login");
  };

  const handleDeleteAccount = () => {
    setUser(null);
    setAppView("auth");
    setAuthView("login");
  };

  if(appView==="app" && user) {
    return <MainApp user={user} onLogout={handleLogout} onDeleteAccount={handleDeleteAccount}/>;
  }

  if(appView==="google-connect" && user) {
    return <GoogleConnectScreen user={user} onConnected={handleGoogleConnected} onSkip={handleSkipGoogle}/>;
  }

  // Auth screens
  if(authView==="signup") return <SignupScreen onSignup={handleSignup} onGoLogin={()=>setAuthView("login")}/>;
  if(authView==="forgot") return <ForgotScreen onGoLogin={()=>setAuthView("login")}/>;
  return <LoginScreen onLogin={handleLogin} onGoSignup={()=>setAuthView("signup")} onGoForgot={()=>setAuthView("forgot")}/>;
}
