import datetime, json, random, time
last_time = time.time()*1000
event_types = ["ajws9td2zv","pl0r8bgl2t","drp6jk6zmf","3f7k5e61l9","ax3jqznn8p","i102htby6a","y4m0621lgc","1mdo92lv2a","36bta1j2l1","tlq1t3tsw9","phwu4kcw79","vzx52lmxew","it3yj6ivku","ceay65vmx7","2q1b7xw1mh"]
event_list = []
for i in range (1,100000):
  curr_event = {}
  last_time = last_time-random.randint(10000,10000000)
  curr_event['date'] = last_time
  curr_event['value'] = random.randint(1,50)
  curr_event['name'] = event_types[random.randint(0,14)]
  event_list.append(curr_event)
with open('output.js','w') as file:
  file.write(json.dumps(event_list))
