function generateText(paragraphes_number) {

	// Sentences version
	document.querySelectorAll('#sentences p').forEach(function(p) {
		if([...p.parentElement.children].indexOf(p)	< paragraphes_number) {
			p.style.display = '';
		} else {
			p.style.display = 'none';
		}
	});

	// Words version
	document.querySelectorAll('#words p:not(:first-of-type)').forEach(function(p) {
		p.parentNode.removeChild(p);
	});
	let firstWordsBlock = document.querySelector('#words p');
	for (let i = 1; i < paragraphes_number; i++) {
		let clone = firstWordsBlock.cloneNode(true);
		firstWordsBlock.after(clone);
	}

	// Fill terms
	document.querySelectorAll('[data-term]').forEach(function(elmt) {
		let type = terms[elmt.getAttribute('data-term')];
		elmt.textContent = type[Math.floor(Math.random() * type.length)];
	});

	// Fill dates
	document.querySelectorAll('[data-date]').forEach(function(elmt) {
		elmt.textContent = new Date().getFullYear() - Math.floor(Math.random() * 35);
	});

	// Fill notes
	document.querySelectorAll('[data-note]').forEach(function(elmt) {
		elmt.textContent = Math.floor(Math.random() * 75) + '/' + Math.floor(Math.random() * 26 + 75);
	});
}

generateText(document.getElementById('paragraphes-number').value);

document.getElementById('generate').addEventListener('click', () => {
	generateText(document.getElementById('paragraphes-number').value);
});

document.querySelectorAll('.js-copy').forEach(function(btn) {
	btn.addEventListener('click', function() {
		navigator.clipboard.writeText(document.querySelector(this.getAttribute('data-target')).innerText.replace(/^\s+/mg, "").replace(new RegExp('\r?\n','g'), '\n\n'));
	});
});

/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   File:   tabs-automatic.js
 *
 *   Desc:   Tablist widget that implements ARIA Authoring Practices
 */

class TabsAutomatic {
  constructor(groupNode) {
    this.tablistNode = groupNode;

    this.tabs = [];

    this.firstTab = null;
    this.lastTab = null;

    this.tabs = Array.from(this.tablistNode.querySelectorAll('[role=tab]'));
    this.tabpanels = [];

    for (var i = 0; i < this.tabs.length; i += 1) {
      var tab = this.tabs[i];
      var tabpanel = document.getElementById(tab.getAttribute('aria-controls'));

      tab.tabIndex = -1;
      tab.setAttribute('aria-selected', 'false');
      this.tabpanels.push(tabpanel);

      tab.addEventListener('keydown', this.onKeydown.bind(this));
      tab.addEventListener('click', this.onClick.bind(this));

      if (!this.firstTab) {
        this.firstTab = tab;
      }
      this.lastTab = tab;
    }

    this.setSelectedTab(this.firstTab, false);
  }

  setSelectedTab(currentTab, setFocus) {
    if (typeof setFocus !== 'boolean') {
      setFocus = true;
    }
    for (var i = 0; i < this.tabs.length; i += 1) {
      var tab = this.tabs[i];
      if (currentTab === tab) {
        tab.setAttribute('aria-selected', 'true');
        tab.removeAttribute('tabindex');
        this.tabpanels[i].classList.remove('is-hidden');
        if (setFocus) {
          tab.focus();
        }
      } else {
        tab.setAttribute('aria-selected', 'false');
        tab.tabIndex = -1;
        this.tabpanels[i].classList.add('is-hidden');
      }
    }
  }

  setSelectedToPreviousTab(currentTab) {
    var index;

    if (currentTab === this.firstTab) {
      this.setSelectedTab(this.lastTab);
    } else {
      index = this.tabs.indexOf(currentTab);
      this.setSelectedTab(this.tabs[index - 1]);
    }
  }

  setSelectedToNextTab(currentTab) {
    var index;

    if (currentTab === this.lastTab) {
      this.setSelectedTab(this.firstTab);
    } else {
      index = this.tabs.indexOf(currentTab);
      this.setSelectedTab(this.tabs[index + 1]);
    }
  }

  /* EVENT HANDLERS */

  onKeydown(event) {
    var tgt = event.currentTarget,
      flag = false;

    switch (event.key) {
      case 'ArrowLeft':
        this.setSelectedToPreviousTab(tgt);
        flag = true;
        break;

      case 'ArrowRight':
        this.setSelectedToNextTab(tgt);
        flag = true;
        break;

      case 'Home':
        this.setSelectedTab(this.firstTab);
        flag = true;
        break;

      case 'End':
        this.setSelectedTab(this.lastTab);
        flag = true;
        break;

      default:
        break;
    }

    if (flag) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  onClick(event) {
    this.setSelectedTab(event.currentTarget);
  }
}

// Initialize tablist

document.querySelectorAll('[role=tablist]').forEach(function(tablist) {
    new TabsAutomatic(tablist);
});
