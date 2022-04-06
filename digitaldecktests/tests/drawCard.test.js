"use strict";

const { test, l, Locator, go, click, type, waitForElement, exists } = require('testim');

Locator.set(require('./locators/locators.js'));

test("Test Draw Card", async () => {

  await go("http://localhost:3000/");
  await click(l("Create"));
  await click(l("[type='text']"));
  await type(l("[type='text']"), 'test');
  await type(l("[min='1']"), '1');
  await type(l(".input-form_>_:nth-child(4)_[type='"), '1');
  await type(l(".input-form_>_:nth-child(5)_[type='"), '1');
  await click(l("Start"));
  await waitForElement(l("test"));
  await click(l("[id='app']_>_:nth-child(1)_>_:nth-c"));
  await click(l(".card-deck"));
  //TODO Please add an assertion here
await exists(l("[id='card1']_img"));
});
