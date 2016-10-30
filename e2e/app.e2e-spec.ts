import { SpadesPage } from './app.po';

describe('spades App', function() {
  let page: SpadesPage;

  beforeEach(() => {
    page = new SpadesPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('sp works!');
  });
});
