import { AppPage, LoginPage } from './app.po';
import { browser, logging } from 'protractor';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    
    //expect(page.getTitleText()).toEqual('chat app is running!');
  });
});

describe('workspace-project Login', () => {
  let page: LoginPage;

  beforeEach(() => {
    page = new LoginPage();
  });

  it('login user', () => {
    page.navigateTo();
    page.loginUser();
    //expect(page.getTitleText()).toEqual('chat app is running!');
  });
});