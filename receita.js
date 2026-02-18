const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Transaction = require('../../models/Transaction');
const User = require('../../models/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('receita')
        .setDescription('Registra uma nova receita')
        .addNumberOption(option => option.setName('valor').setDescription('Valor da receita').setRequired(true))
        .addStringOption(option => option.setName('categoria').setDescription('Categoria da receita').setRequired(true))
        .addStringOption(option => option.setName('descricao').setDescription('Descrição opcional').setRequired(false)),
    async execute(interaction) {
        const amount = interaction.options.getNumber('valor');
        const category = interaction.options.getString('categoria');
        const description = interaction.options.getString('descricao') || 'Sem descrição';
        const userId = interaction.user.id;

        try {
            // Criar transação
            await Transaction.create({
                userId,
                type: 'income',
                amount,
                category,
                description
            });

            // Atualizar saldo do usuário
            let user = await User.findOne({ userId });
            if (!user) {
                user = await User.create({ userId, balance: amount });
            } else {
                user.balance += amount;
                await user.save();
            }

            const embed = new EmbedBuilder()
                .setTitle('✅ Receita Registrada')
                .setColor(0x00FF00)
                .addFields(
                    { name: 'Valor', value: `R$ ${amount.toFixed(2)}`, inline: true },
                    { name: 'Categoria', value: category, inline: true },
                    { name: 'Novo Saldo', value: `R$ ${user.balance.toFixed(2)}` }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply('Ocorreu um erro ao registrar a receita.');
        }
    },
};
