import { element, by, ElementFinder } from 'protractor';

export class DocumentTaskComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    deleteButtons = element.all(by.css('jhi-document-task div table .btn-danger'));
    title = element.all(by.css('jhi-document-task div h2#page-heading span')).first();

    async clickOnCreateButton() {
        await this.createButton.click();
    }

    async clickOnLastDeleteButton() {
        await this.deleteButtons.last().click();
    }

    async countDeleteButtons() {
        return this.deleteButtons.count();
    }

    async getTitle() {
        return this.title.getText();
    }
}

export class DocumentTaskUpdatePage {
    pageTitle = element(by.id('jhi-document-task-heading'));
    saveButton = element(by.id('save-entity'));
    cancelButton = element(by.id('cancel-save'));
    inputDocumentIdInput = element(by.id('field_inputDocumentId'));
    outputDocumentIdInput = element(by.id('field_outputDocumentId'));
    taskStateSelect = element(by.id('field_taskState'));
    failureDescriptionInput = element(by.id('field_failureDescription'));

    async getPageTitle() {
        return this.pageTitle.getText();
    }

    async setInputDocumentIdInput(inputDocumentId) {
        await this.inputDocumentIdInput.sendKeys(inputDocumentId);
    }

    async getInputDocumentIdInput() {
        return this.inputDocumentIdInput.getAttribute('value');
    }

    async setOutputDocumentIdInput(outputDocumentId) {
        await this.outputDocumentIdInput.sendKeys(outputDocumentId);
    }

    async getOutputDocumentIdInput() {
        return this.outputDocumentIdInput.getAttribute('value');
    }

    async setTaskStateSelect(taskState) {
        await this.taskStateSelect.sendKeys(taskState);
    }

    async getTaskStateSelect() {
        return this.taskStateSelect.element(by.css('option:checked')).getText();
    }

    async taskStateSelectLastOption() {
        await this.taskStateSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async setFailureDescriptionInput(failureDescription) {
        await this.failureDescriptionInput.sendKeys(failureDescription);
    }

    async getFailureDescriptionInput() {
        return this.failureDescriptionInput.getAttribute('value');
    }

    async save() {
        await this.saveButton.click();
    }

    async cancel() {
        await this.cancelButton.click();
    }

    getSaveButton(): ElementFinder {
        return this.saveButton;
    }
}

export class DocumentTaskDeleteDialog {
    private dialogTitle = element(by.id('jhi-delete-documentTask-heading'));
    private confirmButton = element(by.id('jhi-confirm-delete-documentTask'));

    async getDialogTitle() {
        return this.dialogTitle.getText();
    }

    async clickOnConfirmButton() {
        await this.confirmButton.click();
    }
}
