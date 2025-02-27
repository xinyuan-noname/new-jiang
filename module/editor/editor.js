class SkillEditorView {
	editor
	constructor(editor) {
		this.editor = editor;
		//
		const back = document.createElement("div");
		back.classList.add("xjb-ED");
		//
		const close = new Image();
		close.src = './extension/新将包/image/icon/close.png';
		close.classList.add("xjb-ED-close");
		close.addEventListener(DEFAULT_EVENT, () => { back.remove() });
		//
		const title = document.createElement('h1');
		title.classList.add("xjb-ED-title")
		title.innerHTML =
			`<div style="display:block">
				<span>魂氏技能编辑器</sapn>
				<span>
					<span class="xjb-ED-icon">📓</span>
					<span class="xjb-ED-icon">⚙️</span>
					<span class="xjb-ED-icon">🆕</span>
				</span>
			</div>
			<div style="display:block">
				<span>上一页</span>
				<span>下一页</span>
			</div>`
		//
		const pageContainer = document.createElement("div");
		pageContainer.classList.add("xjb-ED-pageContainer");
		//
		const page = document.createElement('div');
		page.classList.add("xjb-ED-page-hasBack-flexColumn");
		page.innerHTML =
			`<div class="xjb-ED-subUnit-flexColumn">
				<div class="xjb-ED-subTitle">技能id:</div>
				<textarea style="font-size:1em;height:1em;width:50%;position:relative;"></textarea>
			</div>
			<div class="xjb-ED-subUnit-flexColumn">
				<div class="xjb-ED-subTitle">技能种类:<div>
				<div class="xjb-ED-buttonContainer">
					<div data-kind="trigger">触发类</div>
					<div data-kind='enable:"phaseUse"'>出牌阶段类</div>
					<div data-kind='enable:"chooseToUse"'>使用类</div>
					<div data-kind='enable:"chooseToRespond"'>打出类</div>
					<div data-kind='enable:["chooseToUse","chooseToRespond"]'>使用打出类</div>
				</div>
			</div>`
		//
		pageContainer.append(page);
		//
		back.append(close, title, pageContainer);
		//
		this.ele = {
			back,
			close,
			title,
			titleIcon: title.querySelectorAll(".xjb-ED-icon"),
			pageContainer,
			pageNum: 0,
			pages: [],
		};
	}
	turnNextPage() {
		const { pageContainer } = this.ele;
		pageContainer.appendChild(pageContainer.firstElementChild);
		this.ele.pageNum++;
		this.ele.pageNum %= this.ele.pages.length;
	}
	turnLastPage() {
		const { pageContainer } = this.ele;
		pageContainer.prepend(pageContainer.lastElementChild);
		this.ele.pageNum--;
		if (this.ele.pageNum < 0) this.ele.pageNum += this.ele.pages.length;
	}
}
class SkillEditorData {
	editor;
	constructor(editor) {
		this.editor = editor;
	}
	generateSkill() {

	}
}
class SkillEditor {
	view;
	data;
	constructor() {
		this.view = new SkillEditorView(this);
		this.data = new SkillEditorData(this);
	}
	get ele() {
		return new Proxy(this.view.ele, {
			set() {
				throw new Error("禁止修改!");
			}
		});
	}
}