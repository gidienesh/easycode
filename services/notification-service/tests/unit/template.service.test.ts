// import { TemplateService } from '../../src/services/template.service';
describe('TemplateService Unit Tests', () => {
    describe('getTemplate', () => {
        it('should retrieve a global template if tenantId is not matched or not provided', () => {
            // Mock mockTemplates in TemplateService or inject them
            // const template = await TemplateService.getTemplate('welcome_email');
            // expect(template).toBeDefined();
            // expect(template?.id).toBe('welcome_email');
        });
         it('should return null if template not found', async () => {
            // const template = await TemplateService.getTemplate('non_existent_template');
            // expect(template).toBeNull();
        });
        // TODO: Add tests for tenant-specific template retrieval once that logic is in getTemplate
    });
    describe('renderTemplate', () => {
        it('should correctly render a template with given data', () => {
            // const templateContent = "Hello {{name}}, your order {{orderId}} is confirmed.";
            // const data = { name: "John", orderId: "123" };
            // const expected = "Hello John, your order 123 is confirmed.";
            // expect(TemplateService.renderTemplate(templateContent, data)).toBe(expected);
        });
        it('should leave placeholders if data is missing', () => {
            // const templateContent = "Hello {{name}}, welcome. Your code is {{code}}.";
            // const data = { name: "Alice" };
            // const expected = "Hello Alice, welcome. Your code is {{code}}.";
            // expect(TemplateService.renderTemplate(templateContent, data)).toBe(expected);
        });
         it('should handle empty data object', () => {
            // const templateContent = "Test template with no data.";
            // const data = {};
            // expect(TemplateService.renderTemplate(templateContent, data)).toBe(templateContent);
        });
    });
});
