function externalLinks()
{
  if (!document.getElementsByTagName) return;
  var anchors = document.getElementsByTagName("a");
  for (var i=0; i<anchors.length; i++)
  {
    var anchorElement = anchors[i];
    if (anchorElement.getAttribute("href") && (anchorElement.getAttribute("class") && anchorElement.getAttribute("class").indexOf("external") != -1 || anchorElement.getAttribute("className") && anchorElement.getAttribute("className").indexOf("external") != -1))
    {
      // Set up variables
      var newTitle = 'Further information for this resource opens in a new browser window.'
      var newWindowText = document.createTextNode('(Selecting this link will open a new browser window.)');
      var newTarget = anchorElement.parentNode;
      // Set attributes for new and existing nodes
      anchorElement.setAttribute('target', "_blank");
      anchorElement.setAttribute('title', newTitle)
      newTarget.appendChild(newWindowText);
    }
  }
}
window.onload = externalLinks;