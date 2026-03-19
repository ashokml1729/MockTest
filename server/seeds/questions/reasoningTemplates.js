/**
 * Reasoning & General Intelligence Pattern Templates
 * Based on SSC CGL/CHSL/MTS/GD, RRB NTPC/Group D PYQ patterns.
 * 40+ unique pattern generators: Series, Analogies, Odd-one-out, Coding-Decoding,
 * Direction, Blood Relations, Mirror/Water Images (text-based), Syllogisms, Ranking.
 */
module.exports = [
  // ── ARITHMETIC SERIES (+d) ──
  s => {const st=(s%15)+2,d=(s%7)+2,sr=Array.from({length:6},(_,i)=>st+i*d),ans=sr[5]; return {q:`Complete the series: ${sr.slice(0,5).join(', ')}, ?`,o:[ans,ans+1,ans-1,ans+d],s:`Pattern: +${d}. Next = ${ans}`};},
  // ── ARITHMETIC SERIES (−d) ──
  s => {const st=(s%10)+60,d=(s%5)+3,sr=Array.from({length:6},(_,i)=>st-i*d),ans=sr[5]; return {q:`Complete the series: ${sr.slice(0,5).join(', ')}, ?`,o:[ans,ans+1,ans-1,ans-d],s:`Pattern: −${d}. Next = ${ans}`};},
  // ── GEOMETRIC SERIES (×2) ──
  s => {const st=(s%5)+1,sr=Array.from({length:6},(_,i)=>st*Math.pow(2,i)),ans=sr[5]; return {q:`Next in series: ${sr.slice(0,5).join(', ')}, ?`,o:[ans,ans+sr[4],ans/2,ans*2],s:`Pattern: ×2. Next = ${ans}`};},
  // ── GEOMETRIC SERIES (×3) ──
  s => {const st=(s%3)+1,sr=Array.from({length:5},(_,i)=>st*Math.pow(3,i)),ans=st*Math.pow(3,5); return {q:`Next in series: ${sr.slice(0,4).join(', ')}, ?`,o:[sr[4],sr[4]+1,sr[3]*2,sr[4]-1],s:`Pattern: ×3. Next = ${sr[4]}`};},
  // ── SQUARE SERIES ──
  s => {const st=(s%5)+1,sr=Array.from({length:6},(_,i)=>(st+i)*(st+i)),ans=sr[5]; return {q:`Next in series: ${sr.slice(0,5).join(', ')}, ?`,o:[ans,ans+1,ans-1,ans+2],s:`Pattern: Squares of consecutive numbers. Next = ${Math.sqrt(ans)}² = ${ans}`};},
  // ── CUBE SERIES ──
  s => {const st=(s%4)+1,sr=Array.from({length:5},(_,i)=>Math.pow(st+i,3)),ans=sr[4]; return {q:`Complete: ${sr.slice(0,4).join(', ')}, ?`,o:[ans,ans+1,ans-1,Math.pow(st+5,3)],s:`Pattern: Cubes. Next = ${st+4}³ = ${ans}`};},
  // ── ALTERNATING ADD/SUB ──
  s => {const st=(s%10)+5,a=(s%5)+2,b=(s%3)+1; const sr=[st,st+a,st+a-b,st+2*a-b,st+2*a-2*b,st+3*a-2*b]; return {q:`Next: ${sr.slice(0,5).join(', ')}, ?`,o:[sr[5],sr[5]+1,sr[5]-1,sr[5]+a],s:`Pattern: +${a}, −${b} alternating. Next = ${sr[5]}`};},
  // ── FIBONACCI-LIKE ──
  s => {const a=(s%5)+1,b=(s%5)+2; const sr=[a,b]; for(let i=2;i<7;i++) sr.push(sr[i-1]+sr[i-2]); return {q:`Next: ${sr.slice(0,6).join(', ')}, ?`,o:[sr[6],sr[6]+1,sr[6]-1,sr[5]+sr[3]],s:`Each term = sum of two preceding. Next = ${sr[6]}`};},
  // ── PRIME NUMBER SERIES ──
  s => {const primes=[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47]; const idx=(s%5); const sub=primes.slice(idx,idx+6); return {q:`Next prime: ${sub.slice(0,5).join(', ')}, ?`,o:[sub[5],sub[5]+1,sub[5]-1,sub[5]+2],s:`These are consecutive primes. Next = ${sub[5]}`};},

  // ── ANALOGIES ──
  s => {const ps=[['Dog','Puppy','Cat','Kitten'],['Cow','Calf','Horse','Foal'],['Lion','Cub','Sheep','Lamb'],['Hen','Chick','Duck','Duckling'],['Goat','Kid','Pig','Piglet'],['Eagle','Eaglet','Owl','Owlet'],['Deer','Fawn','Bear','Cub'],['Swan','Cygnet','Goose','Gosling']]; const p=ps[s%ps.length]; return {q:`${p[0]} : ${p[1]} :: ${p[2]} : ?`,o:[p[3],p[1],p[0],p[2]],s:`As ${p[0]} is to ${p[1]}, ${p[2]} is to ${p[3]}`};},
  s => {const ps=[['Pen','Writer','Brush','Painter'],['Book','Reader','Song','Listener'],['Gun','Soldier','Stethoscope','Doctor'],['Key','Lock','Thread','Needle'],['Hammer','Nail','Saw','Wood'],['Brick','Mason','Cloth','Tailor'],['Chalk','Teacher','Scalpel','Surgeon'],['Camera','Photographer','Mic','Singer']]; const p=ps[s%ps.length]; return {q:`${p[0]} : ${p[1]} :: ${p[2]} : ?`,o:[p[3],p[1],p[0],p[2]],s:`As ${p[0]} is related to ${p[1]}, ${p[2]} is related to ${p[3]}`};},
  s => {const ps=[['Pen','Write','Knife','Cut'],['Eye','See','Ear','Hear'],['Food','Eat','Water','Drink'],['Bird','Fly','Fish','Swim'],['Wheel','Roll','Ball','Bounce'],['Rain','Wet','Sun','Dry'],['Night','Dark','Day','Bright'],['Summer','Hot','Winter','Cold']]; const p=ps[s%ps.length]; return {q:`${p[0]} : ${p[1]} :: ${p[2]} : ?`,o:[p[3],p[1],p[0],p[2]],s:`As ${p[0]} is to ${p[1]}, ${p[2]} is to ${p[3]}`};},
  s => {const ps=[['Doctor','Hospital','Teacher','School'],['Pilot','Cockpit','Driver','Cab'],['Judge','Court','Player','Field'],['Chef','Kitchen','Librarian','Library'],['Actor','Stage','Swimmer','Pool'],['Farmer','Farm','Sailor','Ship']]; const p=ps[s%ps.length]; return {q:`${p[0]} : ${p[1]} :: ${p[2]} : ?`,o:[p[3],p[1],p[0],p[2]],s:`${p[0]} works in ${p[1]}, ${p[2]} works in ${p[3]}`};},

  // ── ODD ONE OUT ──
  s => {const gs=[['Rose','Jasmine','Lily','Mango'],['Mumbai','Delhi','Chennai','Everest'],['Circle','Square','Triangle','Cube'],['Piano','Guitar','Violin','Cricket'],['Mercury','Venus','Mars','Moon'],['Potato','Onion','Carrot','Apple'],['Whale','Dolphin','Shark','Blue Whale'],['Pen','Pencil','Eraser','Chair']]; const g=gs[s%gs.length]; return {q:`Find the odd one out: ${g.join(', ')}`,o:[g[3],g[0],g[1],g[2]],s:`${g[3]} does not belong to the group.`};},
  s => {const gs=[['January','March','February','May'],['Kolkata','Chennai','Mumbai','Shimla'],['Iron','Gold','Silver','Diamond'],['Apple','Banana','Grapes','Potato'],['Tennis','Badminton','Cricket','Squash'],['Car','Bus','Truck','Bicycle']]; const g=gs[s%gs.length]; return {q:`Which is different? ${g.join(', ')}`,o:[g[2],g[0],g[1],g[3]],s:`${g[2]} is different from the others.`};},

  // ── CODING-DECODING (letter shift) ──
  s => {const shift=(s%5)+1; const words=['CAT','DOG','PEN','BAT','SUN','MAP','TOP','CUP']; const w=words[s%words.length]; const coded=w.split('').map(c=>String.fromCharCode(c.charCodeAt(0)+shift)).join(''); const wrongs=[w.split('').map(c=>String.fromCharCode(c.charCodeAt(0)+shift+1)).join(''),w.split('').map(c=>String.fromCharCode(c.charCodeAt(0)+shift-1)).join(''),w.split('').map(c=>String.fromCharCode(c.charCodeAt(0)+shift+2)).join('')]; return {q:`If each letter is shifted +${shift} positions, how is "${w}" coded?`,o:[coded,wrongs[0],wrongs[1],wrongs[2]],s:`Each letter +${shift}: ${w} → ${coded}`};},
  s => {const words=['COME','GONE','TALE','MAKE','ROAD','FINE']; const w=words[s%words.length]; const rev=w.split('').reverse().join(''); const wrongs=[w.substring(1)+w[0],w[0]+w.substring(1).split('').reverse().join(''),w.split('').map(c=>String.fromCharCode(c.charCodeAt(0)+1)).join('')]; return {q:`If the code reverses the word, "COME" → "EMOC", then "${w}" is coded as?`,o:[rev,wrongs[0],wrongs[1],wrongs[2]],s:`Reverse of ${w} = ${rev}`};},

  // ── DIRECTION SENSE ──
  s => {const dirs=[{q:'A man walks 5 km North, then turns right and walks 3 km. He is now facing which direction?',a:'East',b:'West',c:'North',d:'South'},{q:'Facing North, Ravi turns left. Which direction is he facing now?',a:'West',b:'East',c:'South',d:'North'},{q:'A person walks 10 km South, turns left and walks 6 km. Turns left again. Facing?',a:'North',b:'South',c:'East',d:'West'},{q:'Starting East, turning right twice. Now facing?',a:'West',b:'East',c:'North',d:'South'},{q:'Facing South, Meena turns 90° clockwise. Now facing?',a:'West',b:'East',c:'North',d:'South'},{q:'From North, a man turns 180°. He is now facing?',a:'South',b:'North',c:'East',d:'West'}]; const d=dirs[s%dirs.length]; return {q:d.q,o:[d.a,d.b,d.c,d.d],s:`Answer: ${d.a}`};},

  // ── BLOOD RELATIONS ──
  s => {const rels=[{q:'A is B\'s father. B is C\'s sister. D is C\'s mother. How is A related to D?',a:'Husband',b:'Brother',c:'Father',d:'Son'},{q:'Pointing to a man, a woman says "His mother is the only daughter of my mother." How is the woman related to the man?',a:'Mother',b:'Sister',c:'Aunt',d:'Grandmother'},{q:'A is B\'s son. C is B\'s father. D is C\'s son. How is A related to D?',a:'Son (or Nephew)',b:'Brother',c:'Father',d:'Grandson'},{q:'If X is the brother of the son of Y\'s son, how is X related to Y?',a:'Grandson',b:'Son',c:'Nephew',d:'Brother'},{q:'Introducing a boy, a girl says "He is the son of my father\'s only brother." How is the boy related to the girl?',a:'Cousin',b:'Brother',c:'Uncle',d:'Nephew'},{q:'A woman introduces a man as "the son of my brother-in-law." How is the man related to her?',a:'Nephew',b:'Son',c:'Brother',d:'Cousin'}]; const r=rels[s%rels.length]; return {q:r.q,o:[r.a,r.b,r.c,r.d],s:`Answer: ${r.a}`};},

  // ── RANKING / POSITION ──
  s => {const tot=(s%15)+25,pos=(s%10)+5,fromEnd=tot-pos+1; return {q:`In a row of ${tot} students, Arun is ${pos}th from the left. His position from the right?`,o:[fromEnd,fromEnd+1,fromEnd-1,tot],s:`Position from right = ${tot} − ${pos} + 1 = ${fromEnd}`};},
  s => {const fromL=(s%8)+5,fromR=(s%8)+8,tot=fromL+fromR-1; return {q:`Priya is ${fromL}th from left, ${fromR}th from right. Total students?`,o:[tot,tot+1,tot-1,fromL+fromR],s:`Total = ${fromL} + ${fromR} − 1 = ${tot}`};},

  // ── CLOCK PROBLEMS ──
  s => {const hrs=[3,6,9,12]; const h=hrs[s%hrs.length]; const angles=[90,180,270,360]; const ang=angles[s%hrs.length]; return {q:`What is the angle between the hands of a clock at ${h} o\'clock?`,o:[ang===360?0:ang,ang+30,ang-30,ang+15].map(v=>v+'°'),s:`At ${h} o'clock, angle = ${ang===360?0:ang}°`};},

  // ── CALENDAR ──
  s => {const qs=[{q:'How many days are there in a leap year?',a:'366',b:'365',c:'364',d:'367'},{q:'If 1st January is Monday, what day is 1st February?',a:'Thursday',b:'Wednesday',c:'Tuesday',d:'Friday'},{q:'Which months have 31 days?',a:'Jan, Mar, May, Jul, Aug, Oct, Dec',b:'All months',c:'Only Jan and Dec',d:'Feb, Apr, Jun'},{q:'A leap year occurs every?',a:'4 years (with century exceptions)',b:'2 years',c:'5 years',d:'10 years'}]; const c=qs[s%qs.length]; return {q:c.q,o:[c.a,c.b,c.c,c.d],s:`Answer: ${c.a}`};},

  // ── MIRROR / WATER IMAGE (text-based) ──
  s => {const qs=[{q:'In a mirror, which letter looks the same as its mirror image?',a:'A',b:'B',c:'F',d:'G'},{q:'Which of these letters does NOT look the same in a mirror? A, H, M, P',a:'P',b:'A',c:'H',d:'M'},{q:'If you look at a clock in a mirror showing 3:00, what time does it appear to show?',a:'9:00',b:'3:00',c:'6:00',d:'12:00'},{q:'The mirror image of "bqd" is?',a:'bqd (reversed)',b:'pqb',c:'dqb',d:'bpd'}]; const c=qs[s%qs.length]; return {q:c.q,o:[c.a,c.b,c.c,c.d],s:`Answer: ${c.a}`};},

  // ── SYLLOGISMS ──
  s => {const qs=[{q:'All cats are animals. All animals are living things. Conclusion?',a:'All cats are living things',b:'All living things are cats',c:'Some animals are not cats',d:'No cat is a living thing'},{q:'Some roses are red. Some red things are flowers. Conclusion?',a:'Some roses may be flowers',b:'All roses are red',c:'All red things are roses',d:'No rose is a flower'},{q:'All students are learners. Ram is a student. Conclusion?',a:'Ram is a learner',b:'All learners are students',c:'Ram is not a learner',d:'Some learners are not students'},{q:'No fish is a bird. All sparrows are birds. Conclusion?',a:'No sparrow is a fish',b:'Some fish are sparrows',c:'All birds are fish',d:'Some sparrows are fish'}]; const c=qs[s%qs.length]; return {q:c.q,o:[c.a,c.b,c.c,c.d],s:`Answer: ${c.a}`};},

  // ── MATHEMATICAL OPERATIONS (symbols swapped) ──
  s => {const qs=[{q:'If + means ×, − means ÷, × means −, ÷ means +, find: 8 + 3 − 6 × 2 ÷ 4',a:'26',b:'10',c:'18',d:'22'},{q:'If × means +, + means −, − means ÷, ÷ means ×, find: 12 × 8 + 4 − 2 ÷ 3',a:'22',b:'18',c:'20',d:'24'},{q:'If > means +, < means −, = means ×, find: 5 = 3 > 2 < 1',a:'16',b:'14',c:'18',d:'20'}]; const c=qs[s%qs.length]; return {q:c.q,o:[c.a,c.b,c.c,c.d],s:`Answer: ${c.a}`};},

  // ── PATTERN COMPLETION (number/letter matrices) ──
  s => {const patterns=[{q:'2, 6, 12, 20, 30, ?',a:'42',b:'40',c:'44',d:'36'},{q:'1, 1, 2, 3, 5, 8, ?',a:'13',b:'11',c:'14',d:'12'},{q:'3, 9, 27, 81, ?',a:'243',b:'162',c:'324',d:'216'},{q:'2, 3, 5, 7, 11, ?',a:'13',b:'12',c:'14',d:'15'},{q:'1, 4, 9, 16, 25, ?',a:'36',b:'30',c:'35',d:'49'},{q:'1, 8, 27, 64, ?',a:'125',b:'100',c:'81',d:'216'},{q:'100, 81, 64, 49, ?',a:'36',b:'25',c:'16',d:'40'}]; const c=patterns[s%patterns.length]; return {q:`Complete: ${c.q}`,o:[c.a,c.b,c.c,c.d],s:`Answer: ${c.a}`};},

  // ── COUNTING FIGURES ──
  s => {const qs=[{q:'How many triangles are in a triangle divided by one line from vertex to base midpoint?',a:'3',b:'2',c:'4',d:'1'},{q:'How many squares are in a 2×2 grid?',a:'5',b:'4',c:'8',d:'6'},{q:'How many rectangles are in a 2×2 grid?',a:'9',b:'8',c:'10',d:'6'},{q:'How many triangles in a star shape (Star of David)?',a:'8',b:'6',c:'10',d:'12'}]; const c=qs[s%qs.length]; return {q:c.q,o:[c.a,c.b,c.c,c.d],s:`Answer: ${c.a}`};},

  // ── LETTER SERIES ──
  s => {const base=(s%5); const letters='ABCDEFGHIJKLMNOPQRSTUVWXYZ'; const gap=(s%3)+1; const sr=Array.from({length:6},(_,i)=>letters[(base+i*gap)%26]); return {q:`Next letter: ${sr.slice(0,5).join(', ')}, ?`,o:[sr[5],letters[(base+6*gap)%26],letters[(base+4*gap+1)%26],letters[(base+5*gap+2)%26]],s:`Pattern: skip ${gap-1}. Next = ${sr[5]}`};},

  // ── NUMBER-LETTER CODING ──
  s => {const qs=[{q:'If A=1, B=2, ... Z=26, then C+A+T = ?',a:'24',b:'23',c:'25',d:'22'},{q:'If A=1, B=2, ..., what is the value of P+E+N?',a:'34',b:'33',c:'35',d:'32'},{q:'If A=26, B=25, ..., Z=1, then G+O+D = ?',a:'40',b:'38',c:'42',d:'36'},{q:'If A=1, B=2, ..., what is S+U+N?',a:'52',b:'50',c:'54',d:'48'}]; const c=qs[s%qs.length]; return {q:c.q,o:[c.a,c.b,c.c,c.d],s:`Answer: ${c.a}`};},

  // ── VENN DIAGRAM (text-based) ──
  s => {const qs=[{q:'In a class of 60 students, 35 play cricket, 25 play football, 10 play both. How many play neither?',a:'10',b:'15',c:'20',d:'5'},{q:'In a group of 100 people, 60 like tea, 40 like coffee, 20 like both. How many like at least one?',a:'80',b:'100',c:'60',d:'40'},{q:'If A has 30 elements, B has 20 elements, A∩B has 10 elements, find A∪B.',a:'40',b:'50',c:'30',d:'20'}]; const c=qs[s%qs.length]; return {q:c.q,o:[c.a,c.b,c.c,c.d],s:`Answer: ${c.a}`};},

  // ── SEATING ARRANGEMENT ──
  s => {const qs=[{q:'Five people A,B,C,D,E sit in a row. A is to the left of B. C sits in the middle. Who sits at the ends?',a:'Depends on arrangement — more info needed',b:'A and E',c:'B and D',d:'Only C'},{q:'In a row of 6, P sits 3rd from left, Q sits 4th from right. How many sit between them?',a:'0 (they are adjacent)',b:'1',c:'2',d:'3'},{q:'6 people sit in a circle. A sits opposite D. B sits to the right of A. Who sits to the left of D?',a:'Need more info',b:'B',c:'A',d:'C'}]; const c=qs[s%qs.length]; return {q:c.q,o:[c.a,c.b,c.c,c.d],s:`Answer: ${c.a}`};},

  // ── MISSING NUMBER IN PATTERN ──
  s => {const qs=[{q:'3, ?, 12, 18, 27 (pattern: ×1.5 approx)',a:'6',b:'8',c:'9',d:'7'},{q:'Find missing: 2, 5, 10, 17, ?, 37',a:'26',b:'25',c:'28',d:'24'},{q:'Find missing: 1, 4, ?, 16, 25',a:'9',b:'8',c:'10',d:'12'},{q:'Find missing: 5, 11, 23, 47, ?',a:'95',b:'94',c:'96',d:'93'}]; const c=qs[s%qs.length]; return {q:c.q,o:[c.a,c.b,c.c,c.d],s:`Answer: ${c.a}`};},

  // ── WORD ARRANGEMENT ──
  s => {const qs=[{q:'Arrange in dictionary order: "Camel", "Camp", "Camera", "Came"',a:'Came, Camel, Camera, Camp',b:'Camel, Came, Camera, Camp',c:'Camera, Came, Camel, Camp',d:'Camp, Camera, Camel, Came'},{q:'Arrange alphabetically: "Bear", "Bark", "Bath", "Ball"',a:'Ball, Bark, Bath, Bear',b:'Bark, Ball, Bath, Bear',c:'Bath, Ball, Bark, Bear',d:'Bear, Bath, Bark, Ball'},{q:'Arrange in meaningful order: Day, Afternoon, Morning, Evening, Night',a:'Morning, Day, Afternoon, Evening, Night',b:'Day, Morning, Afternoon, Evening, Night',c:'Night, Evening, Afternoon, Day, Morning',d:'Morning, Afternoon, Day, Evening, Night'}]; const c=qs[s%qs.length]; return {q:c.q,o:[c.a,c.b,c.c,c.d],s:`Answer: ${c.a}`};},
];
