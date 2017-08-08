﻿'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke products Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/products',
      permissions: '*'
    }, {
      resources: '/api/products/:productId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/products',
      permissions: ['get']
    }, {
      resources: '/api/products/:productId',
      permissions: ['get']
    }]
  }, {
    roles: ['seller'],
    allows: [{
      resources: '/api/products',
      permissions: ['post']
    }, {
      resources: '/api/products/:productId',
      permissions: ['put', 'delete']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/products',
      permissions: ['get']
    }, {
      resources: '/api/products/:productId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If products Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an article is being processed and the current user created it then allow any manipulation
  if (req.article && req.user && req.article.user && req.article.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
