/*
 *  This file is part of SYZOJ.
 *
 *  Copyright (c) 2016 Menci <huanghaorui301@gmail.com>
 *
 *  SYZOJ is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as
 *  published by the Free Software Foundation, either version 3 of the
 *  License, or (at your option) any later version.
 *
 *  SYZOJ is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public
 *  License along with SYZOJ. If not, see <http://www.gnu.org/licenses/>.
 */

'use strict';

let User = syzoj.model('user');

// Ranklist
app.get('/ranklist', async (req, res) => {
  try {
    let page = parseInt(req.query.page);
    if (!page || page < 1) page = 1;

    let count = await User.count({
      is_show: true
    });

    let pageCnt = Math.ceil(count / syzoj.config.page.ranklist);
    if (page > pageCnt) page = pageCnt;

    let ranklist = await User.query(page, syzoj.config.page.ranklist, { is_show: true }, [['ac_num', 'desc']]);

    res.render('ranklist', {
      ranklist: ranklist,
      pageCnt: pageCnt,
      page: page
    });
  } catch (e) {
    console.log(e);
    res.render('error', {
      err: e
    });
  }
});

app.get('/find_user', async (req, res) => {
  try {
    let user = await User.fromName(req.query.nickname);
    if (!user) throw `Can't find user ${req.query.nickname}`;
    res.redirect(syzoj.utils.makeUrl(['user', user.id]));
  } catch (e) {
    console.log(e);
    res.render('error', {
      err: e
    });
  }
});

// Login
app.get('/login', async (req, res) => {
  if (res.locals.user) {
    res.render('error', {
      err: 'Please logout first'
    });
  } else {
    res.render('login');
  }
});

// Sign up
app.get('/sign_up', async (req, res) => {
  if (res.locals.user) {
    res.render('error', {
      err: 'Please logout first'
    });
  } else {
    res.render('sign_up');
  }
});

// Logout
app.get('/logout', async (req, res) => {
  req.session.user_id = null;
  res.redirect(syzoj.utils.makeUrl());
});

// User page
app.get('/user/:id', async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let user = await User.fromID(id);
    user.ac_problems = await user.getACProblems();

    res.render('user', {
      user: user
    });
  } catch (e) {
    console.log(e);
    res.render('error', {
      err: e
    });
  }
});

app.get('/user/:id/edit', async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let user = await User.fromID(id);
    if (!user) throw 'No such user.';

    let allowedEdit = await user.isAllowedEditBy(res.locals.user);
    if (!user.is_public && !allowedEdit) {
      throw 'Permission denied';
    }

    res.render('edit_user', {
      edited_user: user,
      error_info: null
    });
  } catch (e) {
    console.log(e);
    res.render('error', {
      err: e
    });
  }
});

app.post('/user/:id/edit', async (req, res) => {
  let user;
  try {
    let id = parseInt(req.params.id);
    user = await User.fromID(id);

    let allowedEdit = user.isAllowedEditBy(res.locals.user);
    if (!allowedEdit) throw 'Permission denied.';

    if (req.body.old_password && req.body.new_password) {
      if (user.password !== req.body.old_password && !res.locals.user.is_admin) throw 'Old password wrong.';
      user.password = req.body.new_password;
    }

    user.email = req.body.email;
    user.information = req.body.information;

    await user.save();

    res.render('edit_user', {
      edited_user: user,
      error_info: 'Success'
    });
  } catch (e) {
    res.render('edit_user', {
      edited_user: user,
      error_info: e
    });
  }
});
