regexs = [
    '(abc)'
    '[0-9]+'
    '[0-9+'
    '[yY]ves'
    '[yYves'
    '[0-9]{2}-[0-9]{2}-[0-9]{4}'
    '[0-9]{1,}'
    '[0-9]{,1}',
    '[0-9]{}',
    '[0-9]{',
    'Je m\'appelle (\w)'
]

myRegExp = new MyRegExp()
len = regexs.length - 1

for regex, i in regexs
    console.log "[#{i}/#{len}] #{regex} : #{myRegExp.isValid regex}"
