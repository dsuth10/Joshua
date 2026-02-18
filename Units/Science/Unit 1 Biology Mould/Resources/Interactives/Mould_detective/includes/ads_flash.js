function popupCopyright() {
	var newWindow = window.open("includes/copyright.html","popupnewwin","toolbar=no,status=no,scrollbars=yes,location=no,menubar=yes,directories=no,resizable=yes,width=440,height=380");
	if (newWindow != null) {
      newWindow.document.close();
			newWindow.focus();
  }//end if not null
}//end popupnewwin function