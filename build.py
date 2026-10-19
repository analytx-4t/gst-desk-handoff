import re
r=lambda p:open(p).read()
t=r('ui/template.html')
t=t.replace('/*__PARSERS__*/',r('engine/parsers.js').replace('</script','<\\/script')).replace('/*__ANALYZE__*/',r('engine/analyze.js').replace('</script','<\\/script')).replace('/*__UI__*/',r('ui/app.js').replace('</script','<\\/script'))
import os;os.makedirs('dist',exist_ok=True);open('dist/index.html','w').write(t);print(len(t))
