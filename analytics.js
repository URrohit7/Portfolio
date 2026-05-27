
(function(){
  const session = {
    sessionId: crypto.randomUUID(),
    startTime: Date.now(),
    pageViews: 1,
    interactions: 0,
    sectionsVisited: [],
    deviceInfo: {
      platform: navigator.platform,
      userAgent: navigator.userAgent
    }
  };

  document.addEventListener('click', () => {
    session.interactions++;
  });

  document.querySelectorAll('section,[id]').forEach(el => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          const id = entry.target.id || entry.target.tagName;
          if(!session.sectionsVisited.includes(id)){
            session.sectionsVisited.push(id);
          }
        }
      });
    }, {threshold:0.3});

    observer.observe(el);
  });

  window.addEventListener('beforeunload', () => {
    session.duration = Math.round((Date.now() - session.startTime)/1000);

    const all = JSON.parse(localStorage.getItem('analytics-sessions') || '[]');
    all.push(session);

    localStorage.setItem('analytics-sessions', JSON.stringify(all));
  });
})();
