﻿(function () {
  'use strict';

  // Configuring the Articles Admin module
  angular
    .module('products.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Products',
      state: 'admin.products.list'
    });
  }
}());
