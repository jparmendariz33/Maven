import numpy as np, wave, sys
SR=44100; T=46.0; n=int(SR*T)
rng=np.random.default_rng(11)
fx=np.zeros(n); mus=np.zeros(n)
def add(buf,sig,t,g=1.0):
    i=int(t*SR); j=min(n,i+len(sig)); 
    if i<n: buf[i:j]+=sig[:j-i]*g
def tt(d): return np.arange(int(d*SR))/SR
def env(d,a=.005,r=5):
    m=int(d*SR); e=np.ones(m); k=max(1,int(a*SR)); e[:k]=np.linspace(0,1,k); return e*np.exp(-np.linspace(0,1,m)*r)
def kick(g=1):
    d=.4; x=tt(d); f=48+130*np.exp(-x*28); return np.sin(2*np.pi*np.cumsum(f)/SR)*env(d,.001,7)*g
def impact(d=1.6):
    x=tt(d); f=33+95*np.exp(-x*6); sub=np.sin(2*np.pi*np.cumsum(f)/SR)*env(d,.001,3)
    nz=rng.standard_normal(len(x))*env(d,.001,9)*.6; return np.tanh((sub+nz)*2.2)*.9
def lp(sig,k0,k1):
    k=np.linspace(k0,k1,len(sig)); y=np.zeros_like(sig); s=0.
    for i in range(len(sig)): s+=k[i]*(sig[i]-s); y[i]=s
    return y
def whoosh(d=.5,up=True):
    nz=rng.standard_normal(int(d*SR)); y=lp(nz,.02,.4) if up else lp(nz,.4,.02)
    return y*np.sin(np.pi*np.linspace(0,1,len(y)))**2*1.6
def tick(f=2400,g=.25): d=.04; x=tt(d); return np.sin(2*np.pi*f*x)*env(d,.0005,30)*g
def blip(f=880,d=.18,g=.35): x=tt(d); return (np.sin(2*np.pi*f*x)+.4*np.sin(2*np.pi*2*f*x))*env(d,.002,10)*g
def glitch(d=.25,g=.35):
    x=tt(d); s=np.sign(np.sin(2*np.pi*(180+rng.integers(0,900))*x))*(rng.random(len(x))>.3); return s*env(d,.001,6)*g
def riser(d,f0=180,f1=1600,g=.25):
    x=tt(d); f=f0*(f1/f0)**(x/d); ph=2*np.pi*np.cumsum(f)/SR; return (np.sin(ph)+.3*np.sign(np.sin(ph*1.01)))*(x/d)**2*g
def downsweep(d=1.0,g=.35):
    x=tt(d); f=900*np.exp(-x*3)+40; ph=2*np.pi*np.cumsum(f)/SR; return np.sign(np.sin(ph))*env(d,.002,3)*g*.6
CRASH=31.75
# ---------- SFX ----------
add(fx,impact(1.2),0,.8); add(fx,glitch(.2),.02)
for i in range(11): add(fx,tick(1500+i*40,.14),.4+i*.09)
for i,b in enumerate((1.6,1.85,2.1)): add(fx,blip(600+i*150,.14,.22),b)
for i,tk in enumerate(np.arange(2.7,4.3,.07)): add(fx,tick(1700+i*45,.15),tk)
add(fx,impact(1.4),4.3,1.0); add(fx,glitch(.18,.3),4.3)
add(fx,impact(.9),7.2,.6); add(fx,glitch(.15,.3),7.2)
add(fx,whoosh(.45),7.65,.7)
for tm,f in ((9.85,660),(13.35,440),(15.3,1046),(16.95,392)): add(fx,blip(f,.2,.3),tm)
for tm in (16.2,16.45,16.7): add(fx,tick(1300,.18),tm)
add(fx,whoosh(.6),17.25,.9); add(fx,glitch(.15,.25),17.8)
for k in range(4): add(fx,tick(2000,.2),18.3+1.4*k/3)
add(fx,blip(523,.16,.22),19.25); add(fx,blip(784,.16,.22),20.2); add(fx,blip(659,.14,.2),21.35)
add(fx,blip(880,.16,.24),22.6); add(fx,blip(988,.16,.24),25.7)
add(fx,glitch(.12,.22),29.9); add(fx,impact(.6),29.9,.35)
add(fx,riser(1.7,150,1700,.22),CRASH-1.7)
add(fx,impact(2.0),CRASH,1.25); add(fx,glitch(.45,.4),CRASH); add(fx,downsweep(1.3),CRASH+.02)
for k in range(10): add(fx,tick(1600,.14),32.35+1.15*k/9)
add(fx,blip(330,.3,.32),32.8)
add(fx,whoosh(.45),33.45,.8)
for i,tm in enumerate((34.0,34.55,35.1,35.65,37.0,37.55)): add(fx,blip(500+i*90,.14,.26),tm)
add(fx,blip(1046,.25,.3),37.9)
add(fx,downsweep(.6,.25),38.6)
add(fx,whoosh(.5),39.2,.8); add(fx,glitch(.12,.2),39.55)
add(fx,impact(1.2),39.98,.8)
add(fx,blip(880,.25,.32),42.6); add(fx,blip(330,.35,.36),43.55); add(fx,impact(.9),43.55,.5)
add(fx,blip(1175,.2,.22),44.8)
# ---------- MUSIC BED: dark pad + pulse ----------
x=np.arange(n)/SR
def saw(f): return 2*((x*f)%1)-1
chordA=[55,82.41,110,130.81]; chordF=[43.65,87.31,110,130.81]
pad=np.zeros(n)
for i in range(n//SR+1): pass
seglen=4.0
for k in range(int(T/seglen)+1):
    a,b=int(k*seglen*SR),min(n,int((k+1)*seglen*SR))
    ch=chordA if k%2==0 else chordF
    for f in ch: pad[a:b]+=saw(f*1.003)[a:b]*.25+saw(f*.997)[a:b]*.25
pad=lp(pad,.035,.035)
pad*=0.6+0.4*np.sin(2*np.pi*x/8)**2
mus+=pad*.5
beat=.6
for b in np.arange(8.0,44.4,beat):
    if 29.8<=b<32.3: continue
    add(mus,kick(.8),b)
    hd=.05; add(mus,rng.standard_normal(int(hd*SR))*env(hd,.001,25)*.12,b+beat/2)
# heartbeat accelerating before crash
hb=29.85
while hb<CRASH-.15:
    add(mus,kick(.9),hb); add(mus,kick(.6),hb+.16)
    hb+=max(.28,.75-(hb-29.85)*.25)
# silence around crash in pad
m=np.ones(n); a,b=int((CRASH-.05)*SR),int((CRASH+.6)*SR); m[a:b]=0; m[b:b+int(.4*SR)]=np.linspace(0,1,int(.4*SR)); mus*=m
# fade in/out
fi=int(.5*SR); mus[:fi]*=np.linspace(0,1,fi); fo=int(1.5*SR); mus[-fo:]*=np.linspace(1,0,fo)
# ---------- VOICE + ducking ----------
w=wave.open(sys.argv[1]); vsr=w.getframerate(); ch=w.getnchannels()
v=np.frombuffer(w.readframes(w.getnframes()),'<i2').astype(float)/32768
if ch==2: v=v.reshape(-1,2).mean(1)
assert vsr==SR
voice=np.zeros(n); add(voice,v,0.5)
e=np.abs(voice); win=int(.12*SR); e=np.convolve(e,np.ones(win)/win,'same'); e=e/e.max()
duck=1-0.65*np.clip(e*4,0,1)
mus=mus/np.max(np.abs(mus))*.22*duck
fx=fx/np.max(np.abs(fx))*.5*(1-0.35*np.clip(e*4,0,1))
voice=voice/np.max(np.abs(voice))*.92
mix=np.tanh((voice+mus+fx)*1.05)
mix/=np.max(np.abs(mix))*1.05
st=np.stack([mix,mix],1); pcm=(st*32767).astype('<i2')
o=wave.open(sys.argv[2],'wb'); o.setnchannels(2); o.setsampwidth(2); o.setframerate(SR); o.writeframes(pcm.tobytes()); o.close()
print('ok',len(mix)/SR)
