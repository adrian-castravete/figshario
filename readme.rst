figshario
=========

This is a Super Mario clone or better said a platformer

Usage
-----

Start the server with the following command::

  ./server.py

The game is accessed at via HTTP at your IP address on the 8086 port `http://localhost:8086`_.

Creating
--------

The **figshario** engine permits you to edit levels or create new ones. To enable the creator feature you can change its value in the ``config.json`` file. Alternatively you can load another file with the **--config** argument, or enable the editor directly with the **--editor** argument.

Contributing
------------

The project is licensed with the **MIT** licence and uses **flask** and **npm**.
To get started contributing it is advisable to enable *DEBUG*ing in the ``figshario/figshario.py`` file.
Just find the line ``DEBUG = False`` and change it to ``DEBUG = True``.

Prior to editing javascript files you must install the necessary dependencies::

  npm install -g gulp
  npm install

After that you can use the following **gulp** commands::

  gulp build
  gulp watch

The first just builds the bundle ``js/figshario.js`` file while the second watches for any changes in the ``*.js`` files from ``src/`` and launches the *build* step.

.. vim: set tw=80 lbr cc=80:
