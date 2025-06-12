(function(){
  window.buildFooter = function(text){
    const footer = document.createElement('footer');
    footer.className = 'app-footer';
    footer.setAttribute('role','contentinfo');
    footer.textContent = text;
    document.body.appendChild(footer);
  };
})();
