suite('network', function () {

  var  users = [
      {user: 'Hommer', password: '123'},
      {user: 'Bart', password: '123'},
      {user: 'Meg', password: '123'},
      {user: 'Margie', password: '123'},
      {user: 'Lisa', password: '123'},
      {user: 'Milhouse', password: '123'},
      {user: 'Moo', password: '123'},
      {user: 'Krust', password: '123'},
      {user: 'Lenny', password: '123'},
      {user: 'Flanders', password: '123'},
      {user: 'Burns', password: '123'},
      {user: 'Abul', password: '123'},
      {user: 'Nelson', password: '123'},
      {user: 'Dog', password: '123'},
      {user: 'Cat', password: '123'}
    ]

  function signin(u, done) {
    hoodie.account.signIn(u.user, u.password)
      .fail(function () { done(); })
      .done(function () {
        u.hoodieId = hoodie.id();
        done();
      })
  }

  function addUser(u, done) {
    hoodie.account.signOut()
      .fail(function () { done(); })
      .done(function () {
        hoodie.account.signUp(u.user, u.password)
          .fail(function () { signin(u, done); })
          .done(function () { signin(u, done); });
    });
  }

  test('load fixture', function (done) {
    this.timeout(50000);
    // phantomjs seems to keep session data between runs,
    // so clear before running tests
    localStorage.clear();
    async.each(users, addUser, function () {
      hoodie.account.signOut()
        .fail(function () { done(); })
        .done(function(){
          if (!window.mochaPhantomJS) {
            console.table(users);
          }
          done();
      });
    })
  });


  suite('network test', function () {


    setup(function (done) {
      this.timeout(10000);
      localStorage.clear();
      hoodie.account.signIn('Hommer', '123')
        .fail(function (err) {
          done(err);
          assert.ok(false, err.message);
        })
        .done(function () {
          done();
        });
    });

    test('signIn hommer', function (done) {
      this.timeout(10000);
      hoodie.account.signIn('Hommer', '123')
        .fail(function (err) {
          done();
          assert.ok(false, err.message);
        })
        .done(function () {
          assert.equal(
            hoodie.account.username,
            'hommer',
            'should be logged in after signup'
          );
          done();
        });
    });

    test('hommer showd subscribe bart posts', function (done) {
      this.timeout(10000);
      hoodie.pubsub.subscribe(_.find(users, { user: 'Bart' }).hoodieId, 'post')
        .fail(function (err) {
          done((err.message !=='You already subscribed.')? err: null);
          assert.ok(false, err.message);
        })
        .then(function () {
          done();
          assert.ok(true, 'follow with sucess');
        });
    });

    test('hommer not should subscribe bart posts', function (done) {
      this.timeout(10000);
      hoodie.pubsub.subscribe(_.find(users, { user: 'Bart' }).hoodieId, 'post')
        .fail(function (err) {
          done();
          assert.ok((err.message ==='You already subscribed.'), err.message);
        })
        .then(function () {
          done();
          assert.ok(false, 'should throw error [You already subscribed.] ');
        });
    });

    test('hommer showd subscribe marge posts', function (done) {
      this.timeout(10000);
      hoodie.pubsub.subscribe(_.find(users, { user: 'Margie' }).hoodieId, 'post')
        .fail(function (err) {
          done((err.message !=='You already subscribed.')? err: null);
          assert.ok(false, err.message);
        })
        .then(function () {
          assert.ok(true, 'follow with sucess');
          done();
        });
    });

    test('hommer showd subscribe lisa posts', function (done) {
      this.timeout(10000);
      hoodie.pubsub.subscribe(_.find(users, { user: 'Lisa' }).hoodieId, 'post')
        .fail(function (err) {
          done((err.message !=='You already subscribed.')? err: null);
          assert.ok(false, err.message);
        })
        .then(function () {
          assert.ok(true, 'follow with sucess');
          done();
        });
    });

   test('hommer should show 0 subscribers', function (done) {
      this.timeout(10000);
      hoodie.pubsub.subscribers()
        .fail(function (err) {
          done(err);
          assert.ok(false, err.message);
        })
        .then(function (task) {
          assert.ok((task.subscribers.length === 0) , 'subscribers ' + task.subscribers.length + ' with sucess');
          done();
        });
    });

   test('hommer should show 3 subscriptions', function (done) {
      this.timeout(10000);
      hoodie.pubsub.subscriptions()
        .fail(function (err) {
          done(err);
          assert.ok(false, err.message);
        })
        .then(function (task) {
          assert.ok((task.subscriptions.length === 3) , 'subscriptions ' + task.subscriptions.length + ' with sucess');
          done();
        });
    });

    test('hommer showd unsubscribe bart posts', function (done) {
      this.timeout(10000);
      hoodie.pubsub.unsubscribe(_.find(users, { user: 'Bart' }).hoodieId, 'post')
        .fail(function (err) {
          done(err);
          assert.ok(false, err.message);
        })
        .then(function () {
          assert.ok(true, 'follow with sucess');
          done();
        });
    });

    // test('signIn', function (done) {
    //   this.timeout(10000);
    //   assert.ok(!hoodie.account.username, 'start logged out');
    //   hoodie.account.signIn('testuser', 'password')
    //     .fail(function (err) {
    //       assert.ok(false, err.message);
    //     })
    //     .done(function () {
    //       assert.equal(hoodie.account.username, 'testuser');
    //       done();
    //     })
    // });

    // test('signOut', function (done) {
    //   this.timeout(10000);
    //   hoodie.account.signIn('testuser', 'password')
    //     .then(function () {
    //       return hoodie.account.signOut();
    //     })
    //     .fail(function (err) {
    //       assert.ok(false, err.message);
    //     })
    //     .done(function () {
    //       assert.ok(!hoodie.account.username, 'should be logged out');
    //       done();
    //     })
    // });

    // test('signUp while logged in should fail', function (done) {
    //   this.timeout(10000);
    //   hoodie.account.signIn('testuser', 'password')
    //     .then(function () {
    //       return hoodie.account.signUp('testuser2', 'password');
    //     })
    //     .fail(function (err) {
    //       assert.ok(true, 'signUp should fail');
    //       done();
    //     })
    //     .done(function () {
    //       assert.ok(false, 'signUp should not succeed');
    //       done();
    //     })
    // });

  });

});
