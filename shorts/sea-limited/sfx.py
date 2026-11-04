import numpy as np, wave, sys
SR=44100; T=15.0; n=int(SR*T); out=np.zeros(n)
rng=np.random.default_rng(7)
def add(sig,t,g=1.0):
    i=int(t*SR); j=min(n,i+len(sig)); out[i:j]+=sig[:j-i]*g
def env(d,a=.005,r=None):
    m=int(d*SR); e=np.ones(m); k=max(1,int(a*SR)); e[:k]=np.linspace(0,1,k)
    e*=np.exp(-np.linspace(0,1,m)*(r or 5)); return e
def tt(d): return np.arange(int(d*SR))/SR
def kick(g=1):
    d=.35; x=tt(d); f=50+120*np.exp(-x*30); return np.sin(2*np.pi*np.cumsum(f)/SR)*env(d,.001,8)*g
def impact(d=1.6):
    x=tt(d); f=35+90*np.exp(-x*6); sub=np.sin(2*np.pi*np.cumsum(f)/SR)*env(d,.001,3)
    nz=rng.standard_normal(len(x))*env(d,.001,9)*.6
    return np.tanh((sub+nz)*2.2)*.9
def whoosh(d=.5,up=True):
    x=tt(d); nz=rng.standard_normal(len(x)); 
    # moving lowpass via cumulative smoothing with varying coefficient
    k=np.linspace(.02,.4,len(x)) if up else np.linspace(.4,.02,len(x)); y=np.zeros_like(nz); s=0
    for i in range(len(nz)): s+=k[i]*(nz[i]-s); y[i]=s
    e=np.sin(np.pi*np.linspace(0,1,len(x)))**2; return y*e*1.6
def tick(f=2400,g=.25):
    d=.04; x=tt(d); return np.sin(2*np.pi*f*x)*env(d,.0005,30)*g
def blip(f=880,d=.18,g=.35):
    x=tt(d); return (np.sin(2*np.pi*f*x)+.4*np.sin(2*np.pi*f*2*x))*env(d,.002,10)*g
def glitch(d=.25,g=.35):
    x=tt(d); s=np.sign(np.sin(2*np.pi*(180+rng.integers(0,900))*x)); s*= (rng.random(len(x))>.3)
    return s*env(d,.001,6)*g
def riser(d,f0=200,f1=1400,g=.25):
    x=tt(d); f=f0*(f1/f0)**(x/d); ph=2*np.pi*np.cumsum(f)/SR
    return (np.sin(ph)+.3*np.sign(np.sin(ph*1.01)))*(x/d)**2*g
def downsweep(d=1.0,g=.35):
    x=tt(d); f=900*np.exp(-x*3)+40; ph=2*np.pi*np.cumsum(f)/SR; return np.sign(np.sin(ph))*env(d,.002,3)*g*.6
CRASH=7.55
# beat: kick every .5s, muted around crash
for b in np.arange(2.25,15,0.5):
    if 7.1<b<7.95: continue
    add(kick(.45),b)
# hats
for b in np.arange(2.5,13.2,0.25):
    if 7.1<b<7.95: continue
    hd=.05; add(rng.standard_normal(int(hd*SR))*env(hd,.001,25)*.06,b)
# S1
add(impact(1.2),0.0,.8); add(glitch(.2),0.02)
for i,tk in enumerate(np.arange(.5,1.6,.055)): add(tick(1800+i*60,.18),tk)
add(impact(1.4),1.6,1.0); add(glitch(.18,.3),1.6)
add(whoosh(.45),2.0,.7)
# S2 pins
add(blip(660),2.5); 
def tAt(p):
    # match JS eio inverse roughly: pins at time head reaches; approx from JS values
    return p
for tm,f in [(3.63,520),(4.01,1046),(5.0,440)]: add(blip(f),tm)
for tm in (4.9,5.0,5.1): add(tick(1400,.2),tm)
add(whoosh(.5),5.4,.9); add(glitch(.15,.25),5.8)
# S3
for k in range(4): add(tick(2000,.22), 6.1+1.05*(k/3) if k else 6.1)
add(riser(.9,180,1800,.22),CRASH-.9)
add(impact(1.8),CRASH,1.25); add(glitch(.4,.4),CRASH); add(downsweep(1.2),CRASH+.02)
add(whoosh(.35,False),7.75,.6)
for tm in (8.3,8.6,9.0): add(blip(740,.12,.25),tm)
for k in range(10): add(tick(1600,.15),7.9+1.3*k/9)
add(blip(330,.3,.35),8.75)
# S4
add(whoosh(.4),10.35,.8)
for i in range(6): add(blip(500+i*90,.14,.28),10.6+i*.13)
add(impact(.8),12.1,.5); add(downsweep(.6,.3),12.4)
# S5
add(whoosh(.5),12.95,.8); add(glitch(.12,.2),13.25)
add(impact(1.2),13.35,.8)
add(blip(880,.25,.35),13.9); add(blip(330,.35,.4),14.15); add(impact(.9),14.15,.5)
# master
out=np.tanh(out*1.1); out/=np.max(np.abs(out))*1.12
fo=int(.3*SR); out[-fo:]*=np.linspace(1,0,fo)
st=np.stack([out,out],1); pcm=(st*32767).astype('<i2')
w=wave.open(sys.argv[1],'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes()); w.close()
