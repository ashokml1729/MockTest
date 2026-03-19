/**
 * Mathematics Problem Templates with Parameter Variation
 * Based on SSC CGL/CHSL/MTS, RRB NTPC/Group D, IBPS PYQ patterns.
 * Each template generates unique questions by varying numeric parameters.
 * 45+ templates covering: Arithmetic, Algebra, Geometry, Speed/Distance, Profit/Loss, SI/CI, Ratio, Percentages, etc.
 */
module.exports = [
  // ── ARITHMETIC BASICS ──
  (a,b) => {const s=a+b; return {q:`What is ${a} + ${b}?`,o:[s,s+1,s-1,s+2],s:`${a} + ${b} = ${s}`};},
  (a,b) => {const d=Math.abs(a-b); return {q:`What is the difference between ${Math.max(a,b)} and ${Math.min(a,b)}?`,o:[d,d+1,d+2,d-1],s:`${Math.max(a,b)} − ${Math.min(a,b)} = ${d}`};},
  (a,b) => {const p=a*b; return {q:`What is ${a} × ${b}?`,o:[p,p+a,p-b,p+b],s:`${a} × ${b} = ${p}`};},
  (a,b) => {const n=a*b; return {q:`What is ${n} ÷ ${a}?`,o:[b,b+1,b-1,a],s:`${n} ÷ ${a} = ${b}`};},

  // ── PERCENTAGE ──
  (a,b) => {const base=(a+1)*50,pct=(b%20)+5,val=base*pct/100; return {q:`What is ${pct}% of ${base}?`,o:[val,val+5,val-5,val+10],s:`${pct}% of ${base} = ${val}`};},
  (a,b) => {const part=(a+1)*12,whole=(b+2)*100,pct=(part*100/whole); return {q:`${part} is what percent of ${whole}?`,o:[pct,pct+2,pct-2,pct+5],s:`(${part}/${whole})×100 = ${pct}%`};},
  (a,b) => {const orig=(a+2)*100,inc=(b%15)+10,newVal=orig+orig*inc/100; return {q:`If a number ${orig} is increased by ${inc}%, the new number is?`,o:[newVal,newVal+10,newVal-10,orig],s:`${orig} + ${inc}% of ${orig} = ${newVal}`};},
  (a,b) => {const orig=(a+3)*100,dec=(b%15)+5,newVal=orig-orig*dec/100; return {q:`If ${orig} is decreased by ${dec}%, the result is?`,o:[newVal,newVal+10,newVal-10,orig],s:`${orig} − ${dec}% of ${orig} = ${newVal}`};},

  // ── PROFIT & LOSS ──
  (a,b) => {const cp=(a+2)*100,sp=cp+(b+1)*20,pr=sp-cp; return {q:`An article bought for ₹${cp} is sold for ₹${sp}. Find the profit.`,o:[pr,pr+10,pr-10,cp],s:`Profit = ${sp} − ${cp} = ₹${pr}`};},
  (a,b) => {const cp=(a+3)*100,sp=cp-(b+1)*15,ls=cp-sp; return {q:`An article bought for ₹${cp} is sold for ₹${sp}. Find the loss.`,o:[ls,ls+5,ls-5,cp],s:`Loss = ${cp} − ${sp} = ₹${ls}`};},
  (a,b) => {const cp=(a+2)*200,pr=(b%20)+10,pp=cp*pr/100; return {q:`CP = ₹${cp}, Profit = ${pr}%. Find profit amount.`,o:[pp,pp+20,pp-20,cp],s:`Profit = ${cp}×${pr}/100 = ₹${pp}`};},
  (a,b) => {const cp=(a+2)*200,pr=(b%20)+10,sp=cp+cp*pr/100; return {q:`CP = ₹${cp}, Profit% = ${pr}%. Find SP.`,o:[sp,sp+20,sp-cp,cp],s:`SP = ${cp} + ${cp}×${pr}/100 = ₹${sp}`};},
  (a,b) => {const mp=(a+3)*100,disc=(b%20)+10,sp=mp-mp*disc/100; return {q:`MRP = ₹${mp}, Discount = ${disc}%. Find SP.`,o:[sp,sp+10,mp,sp-10],s:`SP = ${mp} − ${disc}% of ${mp} = ₹${sp}`};},

  // ── SIMPLE INTEREST ──
  (a,b) => {const p=(a+1)*1000,r=(b%10)+5,t=2,si=p*r*t/100; return {q:`Find SI on ₹${p} at ${r}% for ${t} years.`,o:[si,si+100,si-50,si+50],s:`SI = ${p}×${r}×${t}/100 = ₹${si}`};},
  (a,b) => {const p=(a+2)*500,r=(b%8)+4,t=3,si=p*r*t/100; return {q:`Find SI on ₹${p} at ${r}% for ${t} years.`,o:[si,si+75,si-75,si+150],s:`SI = ${p}×${r}×${t}/100 = ₹${si}`};},
  (a,b) => {const p=(a+1)*2000,r=(b%6)+5,t=2,si=p*r*t/100,amt=p+si; return {q:`₹${p} at ${r}% SI for ${t} years. Find Amount.`,o:[amt,amt+100,amt-100,p],s:`Amount = ${p} + ${si} = ₹${amt}`};},

  // ── COMPOUND INTEREST ──
  (a,b) => {const p=(a+1)*1000,r=(b%5)+10,t=2,amt=Math.round(p*Math.pow(1+r/100,t)),ci=amt-p; return {q:`Find CI on ₹${p} at ${r}% for ${t} years.`,o:[ci,ci+10,ci-10,ci+20],s:`CI = ${amt} − ${p} = ₹${ci}`};},

  // ── RATIO & PROPORTION ──
  (a,b) => {const r1=a%5+2,r2=b%5+3,tot=(r1+r2)*10,s1=r1*10,s2=r2*10; return {q:`Divide ${tot} in ratio ${r1}:${r2}. Find the larger share.`,o:[Math.max(s1,s2),Math.min(s1,s2),tot,Math.max(s1,s2)+10],s:`Larger share = ${Math.max(s1,s2)}`};},
  (a,b) => {const r1=a%4+1,r2=b%4+2,r3=(a+b)%3+1,tot=(r1+r2+r3)*15,s1=r1*15; return {q:`₹${tot} is divided among A, B, C in ratio ${r1}:${r2}:${r3}. A's share?`,o:[s1,r2*15,r3*15,tot],s:`A's share = ${r1}/(${r1}+${r2}+${r3}) × ${tot} = ₹${s1}`};},

  // ── SPEED, DISTANCE & TIME ──
  (a,b) => {const sp=a+30,t=b+1,d=sp*t; return {q:`A car travels at ${sp} km/h for ${t} hours. Distance covered?`,o:[d,d+sp,d-sp,d+t],s:`Distance = ${sp} × ${t} = ${d} km`};},
  (a,b) => {const d=(a+5)*10,t=b+2,sp=d/t; return {q:`A train covers ${d} km in ${t} hours. Speed?`,o:[sp,sp+5,sp-5,sp+10],s:`Speed = ${d}/${t} = ${sp} km/h`};},
  (a,b) => {const sp=a+40,d=(b+3)*sp; return {q:`Speed = ${sp} km/h, Distance = ${d} km. Time taken?`,o:[d/sp,d/sp+1,d/sp-1,sp],s:`Time = ${d}/${sp} = ${d/sp} hours`};},
  (a,b) => {const sp1=a+20,sp2=a+40,d=(b+1)*sp1*sp2/(sp1+sp2)*2; const avgSp=Math.round(2*sp1*sp2/(sp1+sp2)); return {q:`A person goes at ${sp1} km/h and returns at ${sp2} km/h. Average speed?`,o:[avgSp,Math.round((sp1+sp2)/2),sp1,sp2],s:`Avg speed = 2×${sp1}×${sp2}/(${sp1}+${sp2}) = ${avgSp} km/h`};},

  // ── TIME & WORK ──
  (a,b) => {const d1=a+10,d2=b+15,tog=Math.round(d1*d2/(d1+d2)*100)/100; return {q:`A can do a work in ${d1} days, B in ${d2} days. Together?`,o:[tog,d1,d2,d1+d2],s:`Together = ${d1}×${d2}/(${d1}+${d2}) = ${tog} days`};},
  (a,b) => {const d1=a+8,d2=b+12; const tog=Math.round(d1*d2/(d1+d2)*10)/10; return {q:`A finishes work in ${d1} days, B in ${d2} days. Working together, days needed?`,o:[tog,d1,d2,(d1+d2)/2],s:`Together = (${d1}×${d2})/(${d1}+${d2}) ≈ ${tog} days`};},

  // ── AVERAGES ──
  (a,b) => {const n1=a+20,n2=a+25,n3=b+30,n4=b+35,n5=a+b+15,avg=(n1+n2+n3+n4+n5)/5; return {q:`Find average of ${n1}, ${n2}, ${n3}, ${n4}, ${n5}.`,o:[avg,avg+1,avg-1,avg+2],s:`Average = (${n1}+${n2}+${n3}+${n4}+${n5})/5 = ${avg}`};},
  (a,b) => {const avg=a+25,n=b+5,sum=avg*n; return {q:`Average of ${n} numbers is ${avg}. Find the sum.`,o:[sum,sum+avg,sum-avg,avg],s:`Sum = ${avg} × ${n} = ${sum}`};},

  // ── AGES ──
  (a,b) => {const age=a+20,yrs=b+5,fut=age+yrs; return {q:`A's present age is ${age}. What will be his age after ${yrs} years?`,o:[fut,fut+1,age,fut-1],s:`Age after ${yrs} years = ${age}+${yrs} = ${fut}`};},
  (a,b) => {const age=a+30,yrs=b+3,past=age-yrs; return {q:`B's present age is ${age}. What was the age ${yrs} years ago?`,o:[past,past+1,age,past-1],s:`Age ${yrs} years ago = ${age}−${yrs} = ${past}`};},
  (a,b) => {const r=a%3+2,sum=(b+5)*r*2/(r+1); const age1=Math.round(sum*r/(r+1)),age2=Math.round(sum/(r+1)); return {q:`Ratio of ages of A and B is ${r}:1. Sum of ages = ${age1+age2}. A's age?`,o:[age1,age2,age1+age2,age1-age2],s:`A's age = ${r}/(${r}+1) × ${age1+age2} = ${age1}`};},

  // ── NUMBER SYSTEM ──
  (a,b) => {const n=a*10+b+11; const sq=n*n; return {q:`Find the square of ${n}.`,o:[sq,sq+1,sq-1,sq+n],s:`${n}² = ${sq}`};},
  (a,b) => {const n=(a+2)*(a+2); const sr=a+2; return {q:`Find the square root of ${n}.`,o:[sr,sr+1,sr-1,sr*2],s:`√${n} = ${sr}`};},
  (a,b) => {const n1=a+10,n2=b+15; const lcm=n1*n2/gcd(n1,n2); function gcd(x,y){return y===0?x:gcd(y,x%y);} return {q:`Find the LCM of ${n1} and ${n2}.`,o:[lcm,n1*n2,Math.min(n1,n2),lcm+n1],s:`LCM(${n1},${n2}) = ${lcm}`};},
  (a,b) => {const n1=a+12,n2=b+18; function gcd(x,y){return y===0?x:gcd(y,x%y);} const h=gcd(n1,n2); return {q:`Find the HCF of ${n1} and ${n2}.`,o:[h,n1,n2,h+1],s:`HCF(${n1},${n2}) = ${h}`};},

  // ── GEOMETRY ──
  (a,b) => {const r=a+3,area=Math.round(Math.PI*r*r*100)/100; return {q:`Find the area of a circle with radius ${r} cm. (π ≈ 3.14)`,o:[Math.round(3.14*r*r*100)/100,Math.round(3.14*r*2*100)/100,r*r,2*r],s:`Area = π×${r}² ≈ ${Math.round(3.14*r*r*100)/100} cm²`};},
  (a,b) => {const r=a+5,circ=Math.round(2*3.14*r*100)/100; return {q:`Find the circumference of a circle with radius ${r} cm. (π ≈ 3.14)`,o:[circ,Math.round(3.14*r*r*100)/100,r*2,circ+r],s:`Circumference = 2π×${r} ≈ ${circ} cm`};},
  (a,b) => {const l=a+5,w=b+3,area=l*w,peri=2*(l+w); return {q:`Find the area of a rectangle with length ${l} cm and width ${w} cm.`,o:[area,peri,l+w,area+w],s:`Area = ${l}×${w} = ${area} cm²`};},
  (a,b) => {const l=a+4,w=b+2,peri=2*(l+w); return {q:`Find the perimeter of a rectangle: length ${l} cm, width ${w} cm.`,o:[peri,l*w,l+w,peri+l],s:`Perimeter = 2(${l}+${w}) = ${peri} cm`};},
  (a,b) => {const s=a+6,area=s*s; return {q:`Find the area of a square with side ${s} cm.`,o:[area,4*s,s*2,area+s],s:`Area = ${s}² = ${area} cm²`};},
  (a,b) => {const base=a+8,ht=b+5,area=0.5*base*ht; return {q:`Find the area of a triangle with base ${base} cm and height ${ht} cm.`,o:[area,base*ht,base+ht,area+base],s:`Area = ½×${base}×${ht} = ${area} cm²`};},
  (a,b) => {const l=a+4,w=b+3,h=(a+b)%5+2,vol=l*w*h; return {q:`Volume of a cuboid: ${l}×${w}×${h} cm?`,o:[vol,l*w+w*h,2*(l*w+w*h+l*h),vol+l],s:`Volume = ${l}×${w}×${h} = ${vol} cm³`};},
  (a,b) => {const r=a+2,h=b+5,vol=Math.round(3.14*r*r*h*100)/100; return {q:`Volume of a cylinder: radius ${r} cm, height ${h} cm? (π ≈ 3.14)`,o:[vol,Math.round(3.14*r*r),2*3.14*r*h,vol+r],s:`Volume = π×${r}²×${h} ≈ ${vol} cm³`};},

  // ── PIPES & CISTERNS ──
  (a,b) => {const t1=a+10,t2=b+15,tog=Math.round(t1*t2/(t1+t2)*100)/100; return {q:`Pipe A fills a tank in ${t1} hrs, B in ${t2} hrs. Together?`,o:[tog,t1,t2,t1+t2],s:`Together = ${t1}×${t2}/(${t1}+${t2}) ≈ ${tog} hrs`};},

  // ── TRAINS ──
  (a,b) => {const len=(a+1)*100,sp=(b+5)*18,time=len/sp; const spKm=(b+5)*18*18/5; return {q:`A train ${len}m long passes a pole at ${(b+5)*18} m/s. Time taken?`,o:[Math.round(time*100)/100,Math.round(time+1),len,Math.round(sp)],s:`Time = ${len}/${(b+5)*18} ≈ ${Math.round(time*100)/100} sec`};},
];
