const { test, expect } = require('@jest/globals');
const content = require('./content');

function mockNode(title) {
    return {
        textContent: title,
    };
}

test('extracts page titles', () => {
    const nodes = {
        iterateNext: jest.fn()
    };
    nodes.iterateNext.mockReturnValueOnce(mockNode('Title1'))
                     .mockReturnValueOnce(mockNode('Other title [label]'))
                     .mockReturnValueOnce(mockNode('Something [label2]'))
                     .mockReturnValue(undefined);

    expect(content.getPageTitles(nodes)).toStrictEqual(['Title1','Other title [label]', 'Something [label2]']);
});

test('extracts no labels', () => {
    const titles = ['Title 1', 'Title2[]'];

    expect(content.getLabels(titles)).toStrictEqual([]);
});

test('extracts one label', () => {
    const titles = ['Title [hello there]'];

    expect(content.getLabels(titles)).toStrictEqual(['hello there']);
});

test('extracts two labels on one title', () => {
    const titles = ['Title [l1] [l2] text'];

    expect(content.getLabels(titles)).toStrictEqual(['l1', 'l2']);
});

test('extracts two labels', () => {
    const titles = ['Title [l1]', 'Title2 [l2]'];

    expect(content.getLabels(titles)).toStrictEqual(['l1', 'l2']);
});

test('extracts labels lower case', () => {
    const titles = ['Title [LaBel1]'];

    expect(content.getLabels(titles)).toStrictEqual(['label1']);
});

test('extracts labels merged', () => {
    const titles = ['Title [LaBel1], Title2 [label1]'];

    expect(content.getLabels(titles)).toStrictEqual(['label1']);
});

test('extracts labels ordered', () => {
    const titles = ['Title [l3], Title2 [l1]', 'Title3 [l2]'];

    expect(content.getLabels(titles)).toStrictEqual(['l1', 'l2', 'l3']);
});
