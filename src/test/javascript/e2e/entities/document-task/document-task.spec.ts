import { browser, ExpectedConditions as ec } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { DocumentTaskComponentsPage, DocumentTaskDeleteDialog, DocumentTaskUpdatePage } from './document-task.page-object';

describe('DocumentTask e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let documentTaskUpdatePage: DocumentTaskUpdatePage;
    let documentTaskComponentsPage: DocumentTaskComponentsPage;
    let documentTaskDeleteDialog: DocumentTaskDeleteDialog;

    beforeAll(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load DocumentTasks', async () => {
        await navBarPage.goToEntity('document-task');
        documentTaskComponentsPage = new DocumentTaskComponentsPage();
        expect(await documentTaskComponentsPage.getTitle()).toMatch(/Document Tasks/);
    });

    it('should load create DocumentTask page', async () => {
        await documentTaskComponentsPage.clickOnCreateButton();
        documentTaskUpdatePage = new DocumentTaskUpdatePage();
        expect(await documentTaskUpdatePage.getPageTitle()).toMatch(/Create or edit a Document Task/);
        await documentTaskUpdatePage.cancel();
    });

    it('should create and save DocumentTasks', async () => {
        await documentTaskComponentsPage.clickOnCreateButton();
        await documentTaskUpdatePage.setInputDocumentIdInput('inputDocumentId');
        expect(await documentTaskUpdatePage.getInputDocumentIdInput()).toMatch('inputDocumentId');
        await documentTaskUpdatePage.setOutputDocumentIdInput('outputDocumentId');
        expect(await documentTaskUpdatePage.getOutputDocumentIdInput()).toMatch('outputDocumentId');
        await documentTaskUpdatePage.taskStateSelectLastOption();
        await documentTaskUpdatePage.setFailureDescriptionInput('failureDescription');
        expect(await documentTaskUpdatePage.getFailureDescriptionInput()).toMatch('failureDescription');
        await documentTaskUpdatePage.save();
        expect(await documentTaskUpdatePage.getSaveButton().isPresent()).toBeFalsy();
    });

    it('should delete last DocumentTask', async () => {
        const nbButtonsBeforeDelete = await documentTaskComponentsPage.countDeleteButtons();
        await documentTaskComponentsPage.clickOnLastDeleteButton();

        documentTaskDeleteDialog = new DocumentTaskDeleteDialog();
        expect(await documentTaskDeleteDialog.getDialogTitle()).toMatch(/Are you sure you want to delete this Document Task?/);
        await documentTaskDeleteDialog.clickOnConfirmButton();

        expect(await documentTaskComponentsPage.countDeleteButtons()).toBe(nbButtonsBeforeDelete - 1);
    });

    afterAll(async () => {
        await navBarPage.autoSignOut();
    });
});
