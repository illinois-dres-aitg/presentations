/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   Supplemental JS for the disclosure menu keyboard behavior
 */
'use strict';

var DisclosureMenu = function(domNode) {
  this.rootNode = domNode;
  this.enhancedKeyboardSupport = true;

  document.body.addEventListener('mousedown', this.handleBodyCloseMenus.bind(this));
  document.body.addEventListener('focusin', this.handleBodyCloseMenus.bind(this));

  var containerNodes = this.rootNode.querySelectorAll('ul.menu > li');

  this.menuContainers = [];

  for (var i = 0; i < containerNodes.length; i++) {
    var containerNode = containerNodes[i];
    var buttonNode = containerNode.querySelector('a');

    this.menuContainers[i] = {};
    this.menuContainers[i].hasSubMenu = false;
    this.menuContainers[i].containerNode = containerNode;
    this.menuContainers[i].buttonNode = buttonNode;

    // Updated properties and add event handlers
    containerNode.addEventListener('focusin', this.handleFocusIn.bind(this));

    if (containerNode.classList.contains('menu-item-has-children')) {
      this.menuContainers[i].hasSubMenu = true;

      var menuNode = containerNode.querySelector('.sub-menu');
      var menuitemNodes = containerNode.querySelector('.sub-menu a');

      // Updated properties and add event handlers
      containerNode.addEventListener('focusin', this.handleFocusIn.bind(this));

      // Change link role to button role and set href to '#'
      buttonNode.setAttribute('role', 'button');
      buttonNode.setAttribute('aria-expanded', 'false');
      buttonNode.setAttribute('href', '#');
      buttonNode.setAttribute('aria-controls', 'banner-menu-' + i);

      buttonNode.addEventListener('click', this.handleButtonClick.bind(this));

      menuNode.id = 'banner-menu-' + i;

      this.menuContainers[i].menuNode = menuNode;
      this.menuContainers[i].menuitemNodes = menuitemNodes;
      this.menuContainers[i].firstMenuitemNode = menuitemNodes[0];
      this.menuContainers[i].lastMenuitemNode = menuitemNodes[menuitemNodes.length - 1];
    }
  }
};

DisclosureMenu.prototype.getMenuContainer = function(node) {
  for (var i = 0; i < this.menuContainers.length; i++) {
    var c = this.menuContainers[i];
    if (c.containerNode.contains(node)) {
      return c;
    }
  }
  return false;
};

DisclosureMenu.prototype.openMenu = function(menuNode) {
  menuNode.style.display = 'block';
};

DisclosureMenu.prototype.closeMenus = function(menuNode) {
  if (typeof menuNode !== 'object') {
    menuNode = null;
  }

  for (var i = 0; i < this.menuContainers.length; i++) {
    var mc = this.menuContainers[i];
    if (mc.hasSubMenu && mc.menuNode !== menuNode) {
      mc.menuNode.style.display = 'none';
      mc.buttonNode.setAttribute('aria-expanded', 'false');
    }
  }
};

DisclosureMenu.prototype.toggleExpand = function(menuContainer) {
  var isOpen = menuContainer.buttonNode.getAttribute('aria-expanded') === 'true';

  if (isOpen) {
    this.closeMenus();
  } else {
    this.closeMenus(menuContainer.menuNode);
    menuContainer.buttonNode.setAttribute('aria-expanded', 'true');
    this.openMenu(menuContainer.menuNode);
  }
};

/* Event Handlers */
DisclosureMenu.prototype.handleButtonClick = function(event) {
  var mc = this.getMenuContainer(event.target);
  this.toggleExpand(mc);
  mc.menuButton.focus();
};

DisclosureMenu.prototype.handleFocusIn = function(event) {
  var mc = this.getMenuContainer(event.target);
  this.closeMenus(mc.menuNode);
};

DisclosureMenu.prototype.handleBodyCloseMenus = function(event) {
  if (!this.rootNode.contains(event.target)) {
    this.closeMenus();
  }
};

/* Initialize Disclosure Menus */

window.addEventListener('load', function(event) {
  console.log('init banner menu...');
  var menus = document.querySelectorAll('.banner-menu');
  for (var i = 0; i < menus.length; i++) {
    new DisclosureMenu(menus[i]);
  }
}, false);
