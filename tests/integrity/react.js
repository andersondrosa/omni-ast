(React, moment, toast, reactIcons, services) => {
  const { useState, createElement } = React;
  const {
    bi: { BiChevronLeft },
  } = reactIcons;
  const UpdateItemService = services("UpdateRoleService");

  return function EditTableScreen({ item, model, goBackUrl }) {
    const [name, setName] = useState(item.props.name);
    const [text, setText] = useState(item.props.text);
    const [saving, setSaving] = useState(false);

    const handleClick = () => {
      setSaving(true);

      const promise = UpdateItemService(model.name, item.id, {
        model: model.name,
        props: { name, text },
        tags: [],
      }).finally(() => setSaving(false));

      toast.promise(promise, {
        pending: "Salvando dados...",
        success: "Os dados foram salvos!",
        error: "Não foi possível salvar a atualização",
      });
    };

    return createElement(
      "div",
      { className: "h-screen px-4 py-8 max-w-xl m-auto" },
      createElement(
        "div",
        { className: "bg-white border rounded py-6" },
        createElement(
          "div",
          { className: "px-6 text-lg" },
          "Editar ",
          model.label
        ),
        createElement(
          "div",
          { className: "p-4 flex flex-col gap-4" },
          createElement(
            "div",
            null,
            createElement("label", { htmlFor: "" }, "Nome"),
            createElement("input", {
              type: "text",
              className: "form-input",
              value: name,
              onChange: (e) => setName(e.target.value),
            })
          ),
          createElement(
            "div",
            null,
            createElement("label", { htmlFor: "" }, "Descrição"),
            createElement("textarea", {
              className: "form-input",
              value: text,
              onChange: (e) => setText(e.target.value),
              rows: 10,
            })
          )
        ),
        createElement(
          "div",
          { className: "px-6 flex items-center gap-3" },
          createElement(
            "div",
            { className: "grow text-sm text-slate-500" },
            moment(item.created_at).fromNow()
          ),
          createElement(
            "a",
            { className: "btn btn-default pl-1", href: goBackUrl },
            createElement(BiChevronLeft, { size: 24 }),
            " Voltar"
          ),
          createElement(
            "button",
            {
              className: "btn btn-primary",
              onClick: handleClick,
              disabled: saving,
            },
            "Salvar alterações"
          )
        )
      )
    );
  };
};
