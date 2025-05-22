export const parseJsonData = (content: string) => {
    let parsed = null;
    try {
        const raw = content;
        const jsonText = raw.replace(/```json\n?/, '').replace(/```$/, '');
        parsed = JSON.parse(jsonText);
        console.log('JSON 파싱 완료:', parsed);
    } catch (e) {
        console.error("JSON 파싱 오류:", e);
    }

    return parsed;
}
