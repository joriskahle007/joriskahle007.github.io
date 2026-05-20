.auth-page{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:100px 24px 40px;}
.auth-wrap{width:100%;max-width:460px;position:relative;z-index:10;}
.auth-logo-wrap{text-align:center;margin-bottom:36px;}
.auth-card{background:var(--bg-card);border:1px solid var(--border-dim);border-radius:var(--radius-lg);padding:44px 38px;box-shadow:var(--shadow-card);position:relative;overflow:hidden;}
.auth-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--cyan),var(--magenta));}
.auth-title{font-family:var(--font-display);font-size:24px;font-weight:700;margin-bottom:6px;}
.auth-sub{font-size:13px;color:var(--text-muted);font-family:var(--font-mono);letter-spacing:1px;margin-bottom:32px;}
.form-group{margin-bottom:18px;}
.form-label{display:block;font-family:var(--font-mono);font-size:10px;letter-spacing:2px;color:var(--cyan-dim);text-transform:uppercase;margin-bottom:7px;}
.form-input{width:100%;background:var(--bg-deep);border:1px solid var(--border-dim);border-radius:var(--radius);padding:13px 15px;font-family:var(--font-body);font-size:15px;color:var(--text-primary);outline:none;transition:all .2s;}
.form-input::placeholder{color:var(--text-muted);}
.form-input:focus{border-color:var(--cyan);box-shadow:0 0 0 3px rgba(0,245,255,0.1);}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
.form-hint{font-size:11px;color:var(--text-muted);margin-top:5px;font-family:var(--font-mono);}
.form-check{display:flex;align-items:flex-start;gap:10px;margin-bottom:18px;}
.form-check input[type=checkbox]{width:17px;height:17px;accent-color:var(--cyan);flex-shrink:0;margin-top:3px;cursor:none;}
.form-check label{font-size:13px;color:var(--text-secondary);line-height:1.5;}
.form-check label a{color:var(--cyan);text-decoration:none;}
.btn-auth{width:100%;background:var(--cyan);color:var(--bg-void);border:none;padding:15px;font-family:var(--font-display);font-size:12px;font-weight:700;letter-spacing:2px;border-radius:var(--radius);cursor:none;transition:all .2s;margin-top:6px;}
.btn-auth:hover{background:#fff;box-shadow:var(--shadow-cyan);transform:translateY(-1px);}
.auth-div{display:flex;align-items:center;gap:14px;margin:24px 0;}
.auth-div::before,.auth-div::after{content:'';flex:1;height:1px;background:var(--border-dim);}
.auth-div span{font-family:var(--font-mono);font-size:10px;color:var(--text-muted);letter-spacing:2px;}
.auth-alt{text-align:center;font-size:13px;color:var(--text-muted);margin-top:24px;}
.auth-alt a{color:var(--cyan);text-decoration:none;font-weight:600;}
.auth-alt a:hover{text-decoration:underline;}
.gdpr-box{background:rgba(0,245,255,.04);border:1px solid var(--border-dim);border-radius:var(--radius);padding:14px;margin-top:20px;display:flex;gap:10px;align-items:flex-start;}
.gdpr-box .ico{font-size:16px;flex-shrink:0;}
.gdpr-box p{font-size:11px;color:var(--text-muted);font-family:var(--font-mono);line-height:1.6;}
.gdpr-box p strong{color:var(--cyan-dim);}
.pw-strength{margin-top:7px;display:flex;gap:4px;}
.pw-bar{height:3px;flex:1;background:var(--border-dim);border-radius:2px;transition:background .3s;}
.pw-bar.weak{background:var(--magenta);}
.pw-bar.med{background:var(--gold);}
.pw-bar.strong{background:var(--green-neon);}
.steps{display:flex;justify-content:center;gap:7px;margin-bottom:28px;}
.step-dot{width:8px;height:8px;border-radius:50%;background:var(--border-dim);transition:all .3s;}
.step-dot.active{background:var(--cyan);box-shadow:0 0 8px var(--cyan);width:22px;border-radius:4px;}
@media(max-width:600px){.auth-card{padding:28px 22px;}.form-row{grid-template-columns:1fr;}}
