import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo(){
    return browser.get(browser.baseUrl);
  }

  getTitleText() {
    return element(by.css('app-root')).getText();
  }
  
  clickButton(btn){
    btn.click();
  }
}

export class LoginPage {
  private user = {
    name: 'matt',
    pass: 'asd'
  };

  navigateTo(){
    return browser.get(browser.baseUrl);
  }
  
  loginUser(user: any = this.user){

    console.log(element(by.id('name')));
    
    //.sendKeys(user.name);
    //element(by.name('password')).sendKeys(user.pass);
    //element(by.buttonText('Login')).click();
    
  }
}