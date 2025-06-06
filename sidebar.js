(function(){
  const items=[
    {key:'index',href:'index.html',icon:'🏠',label:'Dashboard'},
    {key:'users',href:'users.html',icon:'👥',label:'Users'},
    {key:'settings',href:'settings.html',icon:'⚙️',label:'Settings'},
    {key:'profile',href:'profile.html',icon:'👤',label:'Profile'},
    {key:'reports',href:'reports.html',icon:'📊',label:'Reports <span class="badge">3</span>'},
    {key:'analytics',href:'analytics.html',icon:'📈',label:'Analytics'},
    {key:'tasks',href:'tasks.html',icon:'📝',label:'Tasks'},
    {key:'calendar',href:'calendar.html',icon:'📅',label:'Calendar'},
    {key:'messages',href:'messages.html',icon:'💬',label:'Messages'},
    {key:'logs',href:'logs.html',icon:'📜',label:'Logs'},
    {key:'status',href:'status.html',icon:'✅',label:'Status'},
    {key:'help',href:'help.html',icon:'❓',label:'Help'}
  ];
  window.buildSidebar=function(active){
    const nav=document.createElement('nav');
    nav.id='sidebar';
    nav.className='sidebar';
    nav.setAttribute('role','navigation');
    const close=document.createElement('button');
    close.id='sidebar-close';
    close.className='close-btn';
    close.setAttribute('aria-label','Close navigation');
    close.textContent='✖';
    nav.appendChild(close);
    const ul=document.createElement('ul');
    items.forEach(it=>{
      const li=document.createElement('li');
      const a=document.createElement('a');
      a.href=it.href;
      a.innerHTML=`<span class="icon" aria-hidden="true">${it.icon}</span>${it.label}`;
      if(it.key===active)a.classList.add('active');
      li.appendChild(a);
      ul.appendChild(li);
    });
    nav.appendChild(ul);
    document.body.appendChild(nav);
  };
})();
