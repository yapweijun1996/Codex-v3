(function(){
  const sections=[
    {
      title:'General',
      items:[
        {key:'index',href:'index.html',icon:'🏠',label:'Dashboard'},
        {key:'users',href:'users.html',icon:'👥',label:'Users'},
        {key:'settings',href:'settings.html',icon:'⚙️',label:'Settings'},
        {key:'profile',href:'profile.html',icon:'👤',label:'Profile'}
      ]
    },
    {
      title:'Work',
      items:[
        {key:'reports',href:'reports.html',icon:'📊',label:'Reports <span class="badge">3</span>'},
        {key:'analytics',href:'analytics.html',icon:'📈',label:'Analytics'},
        {key:'tasks',href:'tasks.html',icon:'📝',label:'Tasks'},
        {key:'calendar',href:'calendar.html',icon:'📅',label:'Calendar'}
      ]
    },
    {
      title:'Communication',
      items:[
        {key:'messages',href:'messages.html',icon:'💬',label:'Messages'}
      ]
    },
    {
      title:'System',
      items:[
        {key:'logs',href:'logs.html',icon:'📜',label:'Logs'},
        {key:'status',href:'status.html',icon:'✅',label:'Status'},
        {key:'help',href:'help.html',icon:'❓',label:'Help'}
      ]
    }
  ];
  window.buildSidebar=function(active){
    const nav=document.createElement('nav');
    nav.id='sidebar';
    nav.className='sidebar';
    nav.setAttribute('role','navigation');
    nav.setAttribute('aria-label','Main sidebar');
    const close=document.createElement('button');
    close.id='sidebar-close';
    close.className='close-btn';
    close.setAttribute('aria-label','Close navigation');
    close.textContent='✖';
    nav.appendChild(close);
    const groups=document.createElement('div');
    groups.className='sidebar-groups';
    sections.forEach((sec,i)=>{
      const group=document.createElement('div');
      group.className='sidebar-group';
      const openState=localStorage.getItem('sidebarGroup-'+i);
      if(openState==='false')group.classList.add('collapsed');
      const toggle=document.createElement('button');
      toggle.type='button';
      toggle.className='sidebar-group-toggle';
      toggle.textContent=sec.title;
      toggle.setAttribute('aria-expanded',openState==='false'? 'false':'true');
      toggle.addEventListener('click',()=>{
        const collapsed=group.classList.toggle('collapsed');
        toggle.setAttribute('aria-expanded',collapsed?'false':'true');
        localStorage.setItem('sidebarGroup-'+i,collapsed?'false':'true');
      });
      const ul=document.createElement('ul');
      ul.setAttribute('role','menu');
      sec.items.forEach(it=>{
        const li=document.createElement('li');
        const a=document.createElement('a');
        a.href=it.href;
        a.setAttribute('role','menuitem');
        a.innerHTML=`<span class="icon" aria-hidden="true">${it.icon}</span>${it.label}`;
        if(it.key===active)a.classList.add('active');
        li.appendChild(a);
        ul.appendChild(li);
      });
      group.appendChild(toggle);
      group.appendChild(ul);
      groups.appendChild(group);
    });
    nav.appendChild(groups);
    const container=document.createElement('aside');
    container.id='sidebar-container';
    container.appendChild(nav);
    document.body.appendChild(container);
  };
})();
