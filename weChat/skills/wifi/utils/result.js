function errorResult(message) {
  return {
    isError: true,
    content: [{ type: 'text', text: message }]
  }
}

function successResult(message, structuredContent) {
  const result = {
    isError: false,
    content: [{ type: 'text', text: message }]
  }
  if (structuredContent !== undefined) {
    result.structuredContent = structuredContent
  }
  return result
}

module.exports = {
  errorResult,
  successResult
}
