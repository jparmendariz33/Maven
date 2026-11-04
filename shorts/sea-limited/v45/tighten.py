import numpy as np, wave, sys
w=wave.open(sys.argv[1]); sr=w.getframerate(); x=np.frombuffer(w.readframes(w.getnframes()),'<i2').astype(float); w.close()
sil=[tuple(map(float,l.split())) for l in open(sys.argv[2]) if len(l.split())==2]
out=[];pos=0
for a,b in sil:
    d=b-a; keep=0.6 if d>0.9 else min(d,0.33)
    ia,ib=int(a*sr),int(b*sr)
    out.append(x[int(pos*sr):ia+int(keep/2*sr)])
    out.append(x[ib-int(keep/2*sr):ib])
    pos=b
out.append(x[int(pos*sr):])
y=np.concatenate(out)
w=wave.open(sys.argv[3],'wb');w.setnchannels(1);w.setsampwidth(2);w.setframerate(sr);w.writeframes(y.astype('<i2').tobytes());w.close()
print(len(y)/sr)
