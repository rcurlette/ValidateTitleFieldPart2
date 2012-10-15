Type.registerNamespace("Company.Extensions");

Company.Extensions.ValidateTitleFieldCommand = function ValidateTitleFieldCommand() {
    Type.enableInterface(this, "Company.Extensions.ValidateTitleFieldCommand");
    this.addInterface("Tridion.Cme.Command", ["ValidateTitleFieldCommand"]);
};

Company.Extensions.ValidateTitleFieldCommand.prototype._isAvailable = function ValidateTitleFieldCommand$_isAvailable(selection) {
    console.debug("Is Available called");
    return $cme.getCommand("Save")._isAvailable(selection);
};

Company.Extensions.ValidateTitleFieldCommand.prototype._isEnabled = function ValidateTitleFieldCommand$_isEnabled(selection) {
    console.debug("Is Enabled called");
    return $cme.getCommand("Save")._isEnabled(selection);
};

Company.Extensions.ValidateTitleFieldCommand.prototype._execute = function ValidateTitleFieldCommand$_execute(selection, pipeline) {
    console.debug("Execute called");
    var item = $display.getItem();
    var failed = false;
    if (item) {
        if (item.getItemType() == "tcm:16") {
            // We know it's a component
            var fieldBuilder = $display.getView().properties.controls.fieldBuilder;
            if (fieldBuilder.getField("Title")) {
                // We have a field named Title
                var titleField = fieldBuilder.getField("Title");
                if (titleField.getValues().length > 0) {
                    var fieldValue = titleField.getValues()[0];
                    console.debug("Current title value is " + fieldValue);
                    // Voodoo magic
                    var firstCharacter = fieldValue.substring(0, 1);
                    if (isNaN(firstCharacter)) {
                        if (firstCharacter != firstCharacter.toUpperCase()) {
                            console.debug("First character is NOT uppercase");
                            alert("First character of 'Title' field must be uppercase");
                            failed = true;
                        } else {
                            console.debug("First character is uppercase");
                        }
                    } else {
                        // Interestingly isNaN returns false on a space. Good to know, I guess
                        console.debug("First character is a number!");
                        alert("First character of 'Title' field cannot be a number.");
                        failed = true;
                    }
                }
            }
        }
    }
    if (!failed)
        return $cme.getCommand("Save")._execute(selection, pipeline);
};


